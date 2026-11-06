import prisma from "../prisma.js";

async function getSeller(userId: string) {
    const seller = await prisma.seller.findUnique({
        where: { userId: userId }
    });
    return seller;
}

async function getSellerProducts(sellerId: string) {
    const products = await prisma.product.findMany({
        where: { sellerId: sellerId },
        include: { category: true, productImages: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" }
    });
    return products;
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

export { getSeller, getSellerProducts, getSellerOrders };