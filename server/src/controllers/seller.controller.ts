import { getSeller, updateSellerStoreName, getSellerProducts, getSellerOrders, updateSellerOrderStatus, updateSellerProductStock, updateSellerProductDetails } from "../services/seller.service.js";
import type { Request, Response } from "express";
import { SellerOrderStatus } from "../../generated/prisma/enums.js";
import AppError from "../utils/appError.js";

async function getOwnedSeller(req: Request) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const seller = await getSeller(req.user.id);
    if (!seller) throw new AppError("Seller profile not found", 404);
    return seller;
}

function isSellerOrderStatus(value: unknown): value is SellerOrderStatus {
    return typeof value === "string" && Object.values(SellerOrderStatus).some((status) => status === value);
}

async function getSellerbyId (req: Request, res: Response) {
    const { sellerId } = req.params as { sellerId: string };
    if (!req.user || sellerId !== req.user.id) throw new AppError("Forbidden", 403);
    const seller = await getOwnedSeller(req);
    res.json(seller);
}

async function updateSellerStoreNameById(req: Request, res: Response) {
    const { sellerId } = req.params as { sellerId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const { storeName, expectedUpdatedAt } = req.body ?? {};
    if (typeof storeName !== "string" || !storeName.trim() || storeName.trim().length > 100) {
        throw new AppError("Store name must be between 1 and 100 characters", 400);
    }
    if (typeof expectedUpdatedAt !== "string" || Number.isNaN(Date.parse(expectedUpdatedAt))) {
        throw new AppError("Valid store version is required", 400);
    }
    const updated = await updateSellerStoreName(seller.id, new Date(expectedUpdatedAt), storeName.trim());
    res.json(updated);
}

async function getSellerProductsBySellerId(req: Request, res: Response) {
    const { sellerId } = req.params as { sellerId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const products = await getSellerProducts(sellerId);
    res.json(products);
}

async function updateSellerProductStockById(req: Request, res: Response) {
    const { sellerId, productId } = req.params as { sellerId: string; productId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const stock: unknown = req.body?.stock;
    const expectedStock: unknown = req.body?.expectedStock;
    const isValidStock = (value: unknown): value is number =>
        typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2147483647;
    if (!isValidStock(stock) || !isValidStock(expectedStock)) {
        throw new AppError("Stock and expected stock must be non-negative integers up to 2147483647", 400);
    }
    const updated = await updateSellerProductStock(seller.id, productId, expectedStock, stock);
    res.json(updated);
}

async function updateSellerProductDetailsById(req: Request, res: Response) {
    const { sellerId, productId } = req.params as { sellerId: string; productId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const { name, price, categoryId, discountType, discountValue, expectedUpdatedAt } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) throw new AppError("Product name is required", 400);
    if (typeof categoryId !== "string" || !categoryId.trim()) throw new AppError("Product category is required", 400);
    const validMoney = (value: unknown): value is number =>
        typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 1000000000 && Number.isSafeInteger(Math.round(value * 100)) && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;
    if (!validMoney(price)) throw new AppError("Price must be positive with at most two decimal places", 400);
    if (typeof expectedUpdatedAt !== "string" || Number.isNaN(Date.parse(expectedUpdatedAt))) throw new AppError("Valid product version is required", 400);
    if (discountType !== null && discountType !== "PERCENT" && discountType !== "FIXED") throw new AppError("Invalid discount type", 400);
    if ((discountType === null && discountValue !== null) ||
        (discountType !== null && (!validMoney(discountValue) || (discountType === "PERCENT" ? discountValue >= 100 : discountValue >= price)))) {
        throw new AppError("Invalid discount value", 400);
    }
    const updated = await updateSellerProductDetails(seller.id, productId, new Date(expectedUpdatedAt), {
        name: name.trim(), price, categoryId: categoryId.trim(), discountType, discountValue,
    });
    res.json(updated);
}

async function getSellerOrdersBySellerId(req: Request, res: Response) {
    const { sellerId } = req.params as { sellerId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const orders = await getSellerOrders(sellerId);
    res.json(orders);
}

async function updateSellerOrderStatusById(req: Request, res: Response) {
    const { sellerId, orderId } = req.params as { sellerId: string; orderId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const status: unknown = req.body?.status;
    if (!isSellerOrderStatus(status)) {
        throw new AppError("Invalid seller order status", 400);
    }
    const updated = await updateSellerOrderStatus(seller.id, orderId, status);
    res.json(updated);
}

export { getSellerbyId, updateSellerStoreNameById, getSellerProductsBySellerId, getSellerOrdersBySellerId, updateSellerOrderStatusById, updateSellerProductStockById, updateSellerProductDetailsById };