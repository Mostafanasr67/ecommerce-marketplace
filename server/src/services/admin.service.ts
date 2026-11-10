import prisma from "../prisma.js";
import { OrderStatus, PaymentStatus, SellerOrderStatus } from "../../generated/prisma/enums.js";
import AppError from "../utils/appError.js";

type ListParams = {
    page: number;
    limit: number;
    search: string;
};

function paginated<T>(items: T[], totalCount: number, page: number, limit: number) {
    return { items, pagination: { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) } };
}

async function getAdminOverview() {
    const [totalUsers, totalSellers, totalProducts, totalOrders, sales, orders, users, sellers, products] = await Promise.all([
        prisma.user.count(),
        prisma.seller.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({ where: { status: { not: OrderStatus.CANCELLED } }, _sum: { totalAmount: true } }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, email: true } },
                payment: { select: { status: true, method: true } },
                sellerOrders: {
                    include: {
                        seller: { select: { id: true, storeName: true } },
                        orderItems: {
                            include: {
                                product: { select: { id: true, name: true, productImages: { orderBy: { sortOrder: "asc" }, take: 1 } } },
                            },
                        },
                    },
                },
            },
        }),
        prisma.user.findMany({ take: 10, orderBy: { createdAt: "desc" }, select: { id: true, name: true, createdAt: true } }),
        prisma.seller.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } }),
        prisma.product.findMany({ take: 10, orderBy: { createdAt: "desc" }, select: { id: true, name: true, createdAt: true } }),
    ]);

    const activity = [
        ...users.map((user) => ({ id: user.id, kind: "user", label: `New user registration: ${user.name || "Unnamed user"}`, createdAt: user.createdAt })),
        ...sellers.map((seller) => ({ id: seller.id, kind: "seller", label: `New seller registration: ${seller.storeName}`, createdAt: seller.createdAt })),
        ...products.map((product) => ({ id: product.id, kind: "product", label: `New product: ${product.name}`, createdAt: product.createdAt })),
        ...orders.map((order) => ({ id: order.id, kind: "order", label: `New order: ${order.id}`, createdAt: order.createdAt })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

    return {
        stats: {
            totalSales: sales._sum.totalAmount ?? 0,
            totalOrders,
            totalUsers,
            totalProducts,
        },
        recentOrders: orders.map((order) => ({
            ...order,
            itemCount: order.sellerOrders.reduce(
                (count, sellerOrder) => count + sellerOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0),
                0,
            ),
        })),
        activity,
    };
}

async function getAdminUsers(params: ListParams) {
    const where = {
        ...(params.search ? {
            OR: [
                { id: { contains: params.search, mode: "insensitive" as const } },
                { name: { contains: params.search, mode: "insensitive" as const } },
                { email: { contains: params.search, mode: "insensitive" as const } },
            ],
        } : {}),
    };
    const [items, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        }),
        prisma.user.count({ where }),
    ]);
    return paginated(items, totalCount, params.page, params.limit);
}

async function getAdminSellers(params: ListParams) {
    const where = params.search ? {
        OR: [
            { id: { contains: params.search, mode: "insensitive" as const } },
            { storeName: { contains: params.search, mode: "insensitive" as const } },
            { user: { name: { contains: params.search, mode: "insensitive" as const } } },
            { user: { email: { contains: params.search, mode: "insensitive" as const } } },
        ],
    } : {};
    const [items, totalCount] = await Promise.all([
        prisma.seller.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            include: {
                user: { select: { id: true, name: true, email: true } },
                _count: { select: { products: true } },
            },
        }),
        prisma.seller.count({ where }),
    ]);
    return paginated(items, totalCount, params.page, params.limit);
}

async function getAdminProducts(params: ListParams & { categoryId: string; sellerId: string; availability: string }) {
    const where = {
        ...(params.categoryId ? { categoryId: params.categoryId } : {}),
        ...(params.sellerId ? { sellerId: params.sellerId } : {}),
        ...(params.availability === "IN_STOCK" ? { stock: { gt: 0 } } : {}),
        ...(params.availability === "OUT_OF_STOCK" ? { stock: 0 } : {}),
        ...(params.search ? {
            OR: [
                { id: { contains: params.search, mode: "insensitive" as const } },
                { name: { contains: params.search, mode: "insensitive" as const } },
                { seller: { storeName: { contains: params.search, mode: "insensitive" as const } } },
            ],
        } : {}),
    };
    const [items, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            include: {
                category: { select: { id: true, name: true } },
                seller: { select: { id: true, storeName: true, user: { select: { name: true, email: true } } } },
                productImages: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
        }),
        prisma.product.count({ where }),
    ]);
    return paginated(items, totalCount, params.page, params.limit);
}

async function getAdminCategories() {
    return prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
    });
}

async function updateAdminOrderStatus(orderId: string, status: OrderStatus) {
    const updated = await prisma.order.updateMany({
        where: { id: orderId },
        data: { status },
    });
    if (updated.count !== 1) {
        throw new AppError("Order not found", 404);
    }
    return { id: orderId, status };
}

async function getAdminOrders(params: ListParams & { status: string; paymentStatus: string; dateFrom: Date | null; dateTo: Date | null }) {
    const where = {
        ...(params.status ? {
            OR: [
                { status: params.status as OrderStatus },
                { sellerOrders: { some: { status: params.status as SellerOrderStatus } } },
            ],
        } : {}),
        ...(params.paymentStatus ? { payment: { is: { status: params.paymentStatus as PaymentStatus } } } : {}),
        ...(params.dateFrom || params.dateTo ? {
            createdAt: {
                ...(params.dateFrom ? { gte: params.dateFrom } : {}),
                ...(params.dateTo ? { lte: new Date(new Date(params.dateTo).setUTCHours(23, 59, 59, 999)) } : {}),
            },
        } : {}),
        ...(params.search ? {
            AND: [{
                OR: [
                    { id: { contains: params.search, mode: "insensitive" as const } },
                    { fullname: { contains: params.search, mode: "insensitive" as const } },
                    { user: { email: { contains: params.search, mode: "insensitive" as const } } },
                ],
            }],
        } : {}),
    };
    const [items, totalCount] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            include: {
                user: { select: { id: true, name: true, email: true } },
                payment: { select: { id: true, method: true, status: true, amount: true } },
                sellerOrders: {
                    include: {
                        seller: { select: { id: true, storeName: true } },
                        orderItems: {
                            include: {
                                product: {
                                    select: {
                                        id: true, name: true, productImages: { orderBy: { sortOrder: "asc" }, take: 1 },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }),
        prisma.order.count({ where }),
    ]);
    return paginated(items, totalCount, params.page, params.limit);
}

async function getAdminFilterOptions() {
    const [categories, sellers] = await Promise.all([
        prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
        prisma.seller.findMany({ select: { id: true, storeName: true }, orderBy: { storeName: "asc" } }),
    ]);
    return { categories, sellers };
}

export { getAdminOverview, getAdminUsers, getAdminSellers, getAdminProducts, getAdminCategories, getAdminOrders, getAdminFilterOptions, updateAdminOrderStatus };
