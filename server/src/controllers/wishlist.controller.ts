import type { Request, Response } from "express";
import {
	getWishlistService,
	addToWishlistService,
	removeFromWishlistService,
} from "../services/wishlist.service.js";

async function getWishlist(req: Request, res: Response): Promise<void> {
	const userId: string = req.user?.id || "";
	if (!userId) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}
	const wishlist = await getWishlistService(userId);
	res.status(200).json({ wishlist });
}

async function addToWishlist(req: Request, res: Response): Promise<void> {
	const userId: string = req.user?.id || "";
	if (!userId) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}
	const { productId } = req.body;
	if (!productId) {
		res.status(400).json({ error: "productId is required" });
		return;
	}
	const wishlistItem = await addToWishlistService(userId, productId);
	res.status(201).json(wishlistItem);
}

async function removeFromWishlist(req: Request, res: Response): Promise<void> {
	const userId: string = req.user?.id || "";
	if (!userId) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}
	const { productId } = req.params as { productId: string };
	if (!productId) {
		res.status(400).json({ error: "productId is required" });
		return;
	}
	await removeFromWishlistService(userId, productId);
	res.status(200).json({ message: "Removed from wishlist" });
}

export { getWishlist, addToWishlist, removeFromWishlist };
