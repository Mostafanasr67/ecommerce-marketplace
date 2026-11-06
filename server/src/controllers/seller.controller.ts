import { getSeller, getSellerProducts, getSellerOrders } from "../services/seller.service.js";
import type { Request, Response } from "express";
import AppError from "../utils/appError.js";

async function getOwnedSeller(req: Request) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const seller = await getSeller(req.user.id);
    if (!seller) throw new AppError("Seller profile not found", 404);
    return seller;
}

async function getSellerbyId (req: Request, res: Response) {
    const { sellerId } = req.params as { sellerId: string };
    if (!req.user || sellerId !== req.user.id) throw new AppError("Forbidden", 403);
    const seller = await getOwnedSeller(req);
    res.json(seller);
}

async function getSellerProductsBySellerId(req: Request, res: Response) {
    const { sellerId } = req.params as { sellerId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const products = await getSellerProducts(sellerId);
    res.json(products);
}

async function getSellerOrdersBySellerId(req: Request, res: Response) {
    const { sellerId } = req.params as { sellerId: string };
    const seller = await getOwnedSeller(req);
    if (seller.id !== sellerId) throw new AppError("Forbidden", 403);
    const orders = await getSellerOrders(sellerId);
    res.json(orders);
}

export { getSellerbyId, getSellerProductsBySellerId, getSellerOrdersBySellerId };