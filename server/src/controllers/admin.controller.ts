import type { Request, Response } from "express";
import { OrderStatus, PaymentStatus, Role } from "../../generated/prisma/enums.js";
import { getAdminOverview, getAdminUsers, updateAdminUserRole, getAdminSellers, getAdminProducts, getAdminCategories, getAdminOrders, getAdminFilterOptions, updateAdminOrderStatus } from "../services/admin.service.js";
import AppError from "../utils/appError.js";

function stringQuery(req: Request, key: string, fallback = "") {
    const value = req.query[key];
    if (value === undefined) return fallback;
    if (typeof value !== "string") throw new AppError(`${key} must be a string`, 400);
    return value.trim();
}

function pagination(req: Request) {
    const pageValue = stringQuery(req, "page", "1");
    const limitValue = stringQuery(req, "limit", "10");
    const page = Number(pageValue);
    const limit = Number(limitValue);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new AppError("Page must be positive and limit must be between 1 and 100", 400);
    }
    return { page, limit, search: stringQuery(req, "search") };
}

async function fetchAdminOverview(_req: Request, res: Response) {
    res.json(await getAdminOverview());
}

async function fetchAdminUsers(req: Request, res: Response) {
    const params = pagination(req);
    res.json(await getAdminUsers(params));
}

async function changeAdminUserRole(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };
    const role: unknown = req.body?.role;
    const storeName: unknown = req.body?.storeName;

    if (!userId) throw new AppError("User ID is required", 400);
    if (userId === req.user?.id) throw new AppError("You cannot change your own role", 400);
    if (typeof role !== "string" || !Object.values(Role).includes(role as Role)) {
        throw new AppError("Invalid user role", 400);
    }
    if (storeName !== undefined && typeof storeName !== "string") {
        throw new AppError("Store name must be a string", 400);
    }
    if (typeof storeName === "string" && storeName.trim().length > 120) {
        throw new AppError("Store name must be 120 characters or fewer", 400);
    }

    res.json(await updateAdminUserRole(userId, role as Role, typeof storeName === "string" ? storeName : undefined));
}

async function fetchAdminSellers(req: Request, res: Response) {
    res.json(await getAdminSellers(pagination(req)));
}

async function fetchAdminProducts(req: Request, res: Response) {
    const params = pagination(req);
    const availability = stringQuery(req, "availability");
    if (availability && availability !== "IN_STOCK" && availability !== "OUT_OF_STOCK") {
        throw new AppError("Availability must be IN_STOCK or OUT_OF_STOCK", 400);
    }
    res.json(await getAdminProducts({
        ...params,
        categoryId: stringQuery(req, "categoryId"),
        sellerId: stringQuery(req, "sellerId"),
        availability,
    }));
}

async function fetchAdminCategories(_req: Request, res: Response) {
    res.json(await getAdminCategories());
}

async function fetchAdminOrders(req: Request, res: Response) {
    const params = pagination(req);
    const status = stringQuery(req, "status");
    const paymentStatus = stringQuery(req, "paymentStatus");
    const dateFromValue = stringQuery(req, "dateFrom");
    const dateToValue = stringQuery(req, "dateTo");
    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) throw new AppError("Invalid order status", 400);
    if (paymentStatus && !Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)) throw new AppError("Invalid payment status", 400);
    const dateFrom = dateFromValue ? new Date(dateFromValue) : null;
    const dateTo = dateToValue ? new Date(dateToValue) : null;
    if (dateFrom && Number.isNaN(dateFrom.getTime())) throw new AppError("Invalid start date", 400);
    if (dateTo && Number.isNaN(dateTo.getTime())) throw new AppError("Invalid end date", 400);
    if (dateFrom && dateTo && dateFrom > dateTo) throw new AppError("Start date must not be after end date", 400);
    res.json(await getAdminOrders({ ...params, status, paymentStatus, dateFrom, dateTo }));
}

async function fetchAdminFilterOptions(_req: Request, res: Response) {
    res.json(await getAdminFilterOptions());
}

async function changeAdminOrderStatus(req: Request, res: Response) {
    const { orderId } = req.params as { orderId: string };
    const status: unknown = req.body?.status;
    if (!orderId) throw new AppError("Order ID is required", 400);
    if (typeof status !== "string" || !Object.values(OrderStatus).includes(status as OrderStatus)) {
        throw new AppError("Invalid order status", 400);
    }
    res.json(await updateAdminOrderStatus(orderId, status as OrderStatus));
}

export { fetchAdminOverview, fetchAdminUsers, changeAdminUserRole, fetchAdminSellers, fetchAdminProducts, fetchAdminCategories, fetchAdminOrders, fetchAdminFilterOptions, changeAdminOrderStatus };
