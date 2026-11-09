import prisma from "../prisma.js";
import AppError from "../utils/appError.js";
import { Method, OrderStatus, PaymentStatus, SellerOrderStatus, Prisma } from "../../generated/prisma/client.js";
import { effectivePrice } from "../utils/productPricing.js";

const FREE_DELIVERY_THRESHOLD = 2000;
const DELIVERY_FEE = 35;

type CreateOrderInput = {
    addressId?: unknown;
    paymentMethod?: unknown;
    cardId?: unknown;
    couponCode?: unknown;
};

function normalizeCoupon(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    if (typeof value !== "string" || !value.trim() || value.length > 100) throw new AppError("Invalid coupon code", 400);
    const code = value.trim().toUpperCase();
    if (code !== "WELCOME50") throw new AppError("Invalid coupon code", 400);
    return code;
}

function calculateTotals(items: { quantity: number; product: Parameters<typeof effectivePrice>[0] }[], couponCode: string | null) {
    const subtotal = items.reduce((sum, item) => sum.plus(effectivePrice(item.product).mul(item.quantity)), new Prisma.Decimal(0));
    const regularSubtotal = items.reduce((sum, item) => sum.plus(item.product.price.mul(item.quantity)), new Prisma.Decimal(0));
    const couponDiscount = couponCode ? subtotal.mul("0.5").toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP) : new Prisma.Decimal(0);
    const delivery = items.length === 0 || subtotal.greaterThanOrEqualTo(FREE_DELIVERY_THRESHOLD) ? new Prisma.Decimal(0) : new Prisma.Decimal(DELIVERY_FEE);
    return { subtotal, regularSubtotal, couponDiscount, delivery, total: subtotal.minus(couponDiscount).plus(delivery) };
}

async function previewOrder(userId: string, coupon: unknown) {
    const couponCode = normalizeCoupon(coupon);
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
    });
    const items = cart?.cartItems ?? [];
    if (couponCode) {
        if (!items.length) throw new AppError("Add products to your cart before applying a coupon", 400);
        const redemption = await prisma.couponRedemption.findUnique({ where: { userId_code: { userId, code: couponCode } } });
        if (redemption) throw new AppError("You have already used this coupon", 409);
    }
    return { ...calculateTotals(items, couponCode), couponCode };
}

// Builds an order from the user's cart. The shipping address is copied into the order,
// the cart is split into one SellerOrder per seller, and stock is reduced.
async function createOrder(userId: string, data: CreateOrderInput) {
    if (!userId) {
        throw new AppError("User ID is required to create an order", 401);
    }

    const couponCode = normalizeCoupon(data.couponCode);
    const addressId = typeof data.addressId === "string" ? data.addressId : "";
    if (!addressId) {
        throw new AppError("addressId is required", 400);
    }

    const paymentMethod = data.paymentMethod;
    if (paymentMethod !== Method.COD && paymentMethod !== Method.ONLINE) {
        throw new AppError("paymentMethod must be COD or ONLINE", 400);
    }

    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) {
        throw new AppError("Address not found", 404);
    }

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
    });
    if (!cart || cart.cartItems.length === 0) {
        throw new AppError("Cart is empty", 400);
    }

    for (const item of cart.cartItems) {
        if (item.quantity > item.product.stock) {
            throw new AppError(`Not enough stock for ${item.product.name}`, 400);
        }
    }

    const itemsBySeller = new Map<string, typeof cart.cartItems>();
    for (const item of cart.cartItems) {
        const sellerItems = itemsBySeller.get(item.product.sellerId) ?? [];
        sellerItems.push(item);
        itemsBySeller.set(item.product.sellerId, sellerItems);
    }

    const { total: totalAmount, couponDiscount } = calculateTotals(cart.cartItems, couponCode);

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                status: OrderStatus.PENDING,
                totalAmount,
                couponCode,
                couponDiscount,
                fullname: address.fullName,
                phone: address.phone,
                street: address.street,
                city: address.city,
                area: address.area,
                country: address.country,
                building: address.building,
                apartment: address.apartment,
                sellerOrders: {
                    create: [...itemsBySeller].map(([sellerId, sellerItems]) => ({
                        sellerId,
                        status: SellerOrderStatus.PENDING,
                        subTotal: sellerItems.reduce(
                            (sum, item) => sum.plus(effectivePrice(item.product).mul(item.quantity)),
                            new Prisma.Decimal(0),
                        ),
                        orderItems: {
                            create: sellerItems.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: effectivePrice(item.product),
                            })),
                        },
                    })),
                },
                payment: {
                    create: {
                        method: paymentMethod,
                        status: paymentMethod === "ONLINE" ? PaymentStatus.PAID : PaymentStatus.PENDING,
                        amount: totalAmount,
                        cardId: paymentMethod === "ONLINE" ? (typeof data.cardId === "string" ? data.cardId : null) : null,
                    },
                },
            },
            include: {
                sellerOrders: {
                    include: {
                        orderItems: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        price: true,
                                        productImages: {
                                            select: {
                                                id: true,
                                                url: true,
                                                altText: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                payment: true,
            },
        });

        if (couponCode) {
            try {
                await tx.couponRedemption.create({ data: { userId, code: couponCode, orderId: order.id } });
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                    throw new AppError("You have already used this coupon", 409);
                }
                throw error;
            }
        }

        for (const item of cart.cartItems) {
            const updated = await tx.product.updateMany({
                where: { id: item.productId, stock: { gte: item.quantity }, price: item.product.price, discountType: item.product.discountType, discountValue: item.product.discountValue },
                data: { stock: { decrement: item.quantity } },
            });
            if (updated.count === 0) {
                throw new AppError(`Stock or price changed for ${item.product.name}. Please refresh your cart and try again.`, 409);
            }
        }

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return order;
    });
}

async function getOrders(userId: string) {
    if (!userId) {
        throw new AppError("User ID is required to fetch orders", 401);
    }

    const orders = await prisma.order.findMany({
        where: {
            userId
        },
        include: {
            sellerOrders: {
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    productImages: {
                                        select: {
                                            id: true,
                                            url: true,
                                            altText: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            payment: {
                include: {
                    card: {
                        select: {
                            id: true,
                            holderName: true,
                            brand: true,
                            last4: true,
                            expiryMonth: true,
                            expiryYear: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return orders;
}


async function getOrderById(orderId: string, userId: string) {
    if (!userId) {
        throw new AppError("User ID is required to fetch an order", 401);
    }

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
        include: {
            sellerOrders: {
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    productImages: {
                                        select: {
                                            id: true,
                                            url: true,
                                            altText: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            payment: {
                include: {
                    card: {
                        select: {
                            id: true,
                            holderName: true,
                            brand: true,
                            last4: true,
                            expiryMonth: true,
                            expiryYear: true,
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }
    return order;
}


export { createOrder, getOrders, getOrderById, previewOrder };