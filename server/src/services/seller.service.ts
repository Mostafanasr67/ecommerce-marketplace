import prisma from "../prisma.js";
import { OrderStatus, SellerOrderStatus } from "../../generated/prisma/enums.js";
import AppError from "../utils/appError.js";
import { Prisma } from "../../generated/prisma/client.js";
import { effectivePrice } from "../utils/productPricing.js";

type ProductDetailsUpdate = {
    name: string;
    price: number;
    categoryId: string;
    discountType: "PERCENT" | "FIXED" | null;
    discountValue: number | null;
};

const parentOrderStatusBySellerStatus: Record<SellerOrderStatus, OrderStatus> = {
    [SellerOrderStatus.PENDING]: OrderStatus.PENDING,
    [SellerOrderStatus.CONFIRMED]: OrderStatus.CONFIRMED,
    [SellerOrderStatus.PROCESSING]: OrderStatus.PROCESSING,
    [SellerOrderStatus.SHIPPED]: OrderStatus.SHIPPED,
    [SellerOrderStatus.DELIVERED]: OrderStatus.DELIVERED,
    [SellerOrderStatus.CANCELLED]: OrderStatus.CANCELLED,
};

async function getSeller(userId: string) {
    const seller = await prisma.seller.findUnique({
        where: { userId: userId }
    });
    return seller;
}

async function updateSellerStoreName(sellerId: string, expectedUpdatedAt: Date, storeName: string) {
    const updated = await prisma.seller.updateMany({
        where: { id: sellerId, updatedAt: expectedUpdatedAt },
        data: { storeName },
    });
    if (!updated.count) {
        const seller = await prisma.seller.findUnique({ where: { id: sellerId }, select: { id: true } });
        if (!seller) throw new AppError("Seller profile not found", 404);
        throw new AppError("Store settings changed since editing began. Reload and try again.", 409);
    }
    return prisma.seller.findUniqueOrThrow({ where: { id: sellerId } });
}

async function getSellerProducts(sellerId: string) {
    const products = await prisma.product.findMany({
        where: { sellerId: sellerId },
        include: { category: true, productImages: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" }
    });
    return products;
}

async function updateSellerProductStock(sellerId: string, productId: string, expectedStock: number, stock: number) {
    const updated = await prisma.product.updateMany({
        where: { id: productId, sellerId, stock: expectedStock },
        data: { stock },
    });
    if (updated.count === 0) {
        const product = await prisma.product.findFirst({
            where: { id: productId, sellerId },
            select: { id: true },
        });
        if (!product) throw new AppError("Product not found", 404);
        throw new AppError("Stock changed since you started editing. Cancel and edit again using the current stock.", 409);
    }
    return { id: productId, stock };
}

async function updateSellerProductDetails(sellerId: string, productId: string, expectedUpdatedAt: Date, details: ProductDetailsUpdate) {
    const category = await prisma.category.findUnique({ where: { id: details.categoryId }, select: { id: true } });
    if (!category) throw new AppError("Selected category was not found. Choose an existing category.", 400);
    const price = new Prisma.Decimal(details.price);
    const discountValue = details.discountValue === null ? null : new Prisma.Decimal(details.discountValue);
    if (!effectivePrice({ price, discountType: details.discountType, discountValue }).greaterThan(0)) {
        throw new AppError("Discounted price must be greater than zero", 400);
    }
    const updated = await prisma.product.updateMany({
        where: { id: productId, sellerId, updatedAt: expectedUpdatedAt },
        data: { ...details, price, discountValue },
    });
    if (!updated.count) {
        const product = await prisma.product.findFirst({ where: { id: productId, sellerId }, select: { id: true } });
        if (!product) throw new AppError("Product not found", 404);
        throw new AppError("Product changed since editing began. Cancel and edit again.", 409);
    }
    return { id: productId };
}

async function getSellerOrders(sellerId: string) {
    const orders = await prisma.sellerOrder.findMany({
        where: { sellerId: sellerId },
        orderBy: { createdAt: "desc" },
        include: {
            order: {
                include: {
                    payment: {
                        select: {
                            method: true,
                            status: true,
                            amount: true,
                        },
                    },
                },
            },
            orderItems: {
                include: {
                    product: {
                        include: {
                            category: true,
                            productImages: true,
                        },
                    },
                },
            },
        }
    });
    return orders;
}

async function updateSellerOrderStatus(sellerId: string, orderId: string, status: SellerOrderStatus) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.sellerOrder.findFirst({
            where: { id: orderId, sellerId },
            include: { orderItems: { include: { product: { select: { name: true } } } } },
        });
        if (!order) throw new AppError("Seller order not found", 404);
        if (order.status === status) return { id: order.id, status: order.status };

        const updated = await tx.sellerOrder.updateMany({
            where: { id: orderId, sellerId, status: order.status },
            data: { status },
        });
        if (updated.count !== 1) {
            throw new AppError("Order status changed. Please refresh and try again.", 409);
        }

        const items = [...order.orderItems].sort((a, b) => a.productId.localeCompare(b.productId));
        if (status === SellerOrderStatus.CANCELLED) {
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
        } else if (order.status === SellerOrderStatus.CANCELLED) {
            for (const item of items) {
                const reserved = await tx.product.updateMany({
                    where: { id: item.productId, stock: { gte: item.quantity } },
                    data: { stock: { decrement: item.quantity } },
                });
                if (reserved.count !== 1) {
                    throw new AppError(`Not enough stock to reopen this order: ${item.product.name}`, 409);
                }
            }
        }
        const sellerOrderCount = await tx.sellerOrder.count({ where: { orderId: order.orderId } });
        if (sellerOrderCount === 1) {
            await tx.order.update({
                where: { id: order.orderId },
                data: { status: parentOrderStatusBySellerStatus[status] },
            });
        }
        return { id: order.id, status };
    });
}

export { getSeller, updateSellerStoreName, getSellerProducts, getSellerOrders, updateSellerOrderStatus, updateSellerProductStock, updateSellerProductDetails };