import type { Request, Response } from "express";
import {
    getCartService,
    addToCartService,
    removeFromCartService,
    updateCartItemService,
    clearCartService,
} from "../services/cart.service.js";
import { calculateCartTotalService } from "../services/cart.service.js";

async function getCart(req: Request, res: Response): Promise<void> {

    const userId: string = req.user?.id || "";
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const cart = await getCartService(userId);
    const total = await calculateCartTotalService(userId);
    res.status(200).json({ cart, total });

}

async function addToCart(req: Request, res: Response): Promise<void> {

    const userId: string = req.user?.id || "";
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        res.status(400).json({ error: "productId and quantity are required" });
        return;
    }
    const cartItem = await addToCartService(userId, productId, quantity);
    res.status(201).json(cartItem);

}

async function removeFromCart(req: Request, res: Response): Promise<void> {

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
    const result = await removeFromCartService(userId, productId);
    res.status(200).json(result);

}

async function updateCartItem(req: Request, res: Response): Promise<void> {

    const userId: string = req.user?.id || "";
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const { productId } = req.params as { productId: string };
    const { quantity } = req.body;
    if (!productId || !quantity) {
        res.status(400).json({ error: "productId and quantity are required" });
        return;
    }
    const updatedItem = await updateCartItemService(userId, productId, quantity);
    res.status(200).json(updatedItem);
}

async function clearCart(req: Request, res: Response): Promise<void> {

    const userId: string = req.user?.id || "";
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const result = await clearCartService(userId);
    res.status(200).json(result);

}

export {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
};