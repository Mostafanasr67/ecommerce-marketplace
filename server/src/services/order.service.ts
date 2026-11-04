import prisma from "../prisma.js";
import AppError from "../utils/appError.js";
import { Method, OrderStatus, PaymentStatus, SellerOrderStatus } from "../../generated/prisma/client.js";

const FREE_DELIVERY_THRESHOLD = 2000;
const DELIVERY_FEE = 35;

type CreateOrderInput = {
    addressId?: unknown;
    paymentMethod?: unknown;
    cardId?: unknown;
};

// Builds an order from the user's cart. The shipping address is copied into the order,
// the cart is split into one SellerOrder per seller, and stock is reduced.
async function createOrder(userId: string, data: CreateOrderInput) {
    if (!userId) {
        throw new AppError("User ID is required to create an order", 401);
    }

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

    const itemsSubtotal = cart.cartItems.reduce(
        (sum, item) => sum + Number(item.product.price.toString()) * item.quantity,
        0,
    );
    const delivery = itemsSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const totalAmount = itemsSubtotal + delivery;

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                status: OrderStatus.PENDING,
                totalAmount,
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
                            (sum, item) => sum + Number(item.product.price.toString()) * item.quantity,
                            0,
                        ),
                        orderItems: {
                            create: sellerItems.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: item.product.price,
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

        for (const item of cart.cartItems) {
            const updated = await tx.product.updateMany({
                where: { id: item.productId, stock: { gte: item.quantity } },
                data: { stock: { decrement: item.quantity } },
            });
            if (updated.count === 0) {
                throw new AppError(`Not enough stock for ${item.product.name}`, 400);
            }
        }

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return order;
    });
}

async function getOrders() {
    const orders = await prisma.order.findMany({
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
    if (orders.length === 0) {
        throw new Error("No orders found");
    }
    return orders;
}


async function getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId
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
        throw new Error("Order not found");
    }
    return order;
}


export { createOrder, getOrders, getOrderById };