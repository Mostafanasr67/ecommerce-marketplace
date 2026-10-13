import type { Request, Response } from "express";
import { getAllProducts as getAllProductsService, getProductById as getProductByIdService } from "../services/product.service.js";

async function getAllProducts(req: Request, res: Response){
    const products = await getAllProductsService();
    res.json(products);
}

async function getProductById(req: Request, res: Response){
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }

    const product = await getProductByIdService(id);

    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    
    res.json(product);
}

export { getAllProducts, getProductById };