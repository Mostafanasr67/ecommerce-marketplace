import type { Request, Response } from "express";
import type { UpdateProductData, ProductFilters } from "../services/product.service.js";
import { getAllProducts as getAllProductsService, getProductById as getProductByIdService, createProduct as createProductService, updateProduct as updateProductService, deleteProduct as deleteProductService } from "../services/product.service.js";

async function getAllProducts(req: Request, res: Response) {

    const limitQuery = req.query.limit || 10;
    const pageQuery = req.query.page || 1;
    const search = req.query.search;
    const categoryId = req.query.categoryId;
    const sellerId = req.query.sellerId;

    const limit = Number(limitQuery);
    const page = Number(pageQuery);

    if (limit <= 0 || page <= 0 || !Number.isInteger(limit) || !Number.isInteger(page)) {
        res.status(400).json({ error: "Limit and page must be positive integers" });
        return;
    }

    if (search !== undefined && typeof search !== "string" || categoryId !== undefined && typeof categoryId !== "string" || sellerId !== undefined && typeof sellerId !== "string") {
        res.status(400).json({ error: "Search, categoryId, and sellerId must be strings" });
        return;
    }

    const filters: ProductFilters = {
        ...(search ? { search } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(sellerId ? { sellerId } : {})
    };

    const response = await getAllProductsService(limit, page, filters);
    res.json({ products: response.products, pagination: { page, limit, totalCount: response.totalCount, totalPages: response.totalPages } });
}

async function getProductById(req: Request, res: Response) {
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

async function createProduct(req: Request, res: Response) {
    const { name, description, price, stock, categoryId } = req.body;
    const userId = req.user?.id;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        (description !== undefined &&
            description !== null &&
            typeof description !== "string") ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price <= 0 ||
        typeof stock !== "number" ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        typeof categoryId !== "string" ||
        !categoryId.trim() ||
        typeof userId !== "string" ||
        !userId
    ) {
        res.status(400).json({ error: "Missing required fields or Incorrect types" });
        return;
    }


    const product = await createProductService(name.trim(), description ?? null, price, stock, categoryId, userId);
    res.status(201).json(product);

}


async function updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }

    if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }

    const { name, description, price, stock, categoryId } = req.body;

    const data: UpdateProductData = {};

    if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({ error: "Name must be a non-empty string" });
            return;
        }
        data.name = name.trim();
    }

    if (description !== undefined) {
        if (description !== null && typeof description !== "string") {
            res.status(400).json({ error: "Description must be a string or null" });
            return;
        }
        data.description = description;
    }

    if (price !== undefined) {
        if (
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            price <= 0
        ) {
            res.status(400).json({ error: "Price must be a positive finite number" });
            return;
        }
        data.price = price;
    }

    if (stock !== undefined) {
        if (
            typeof stock !== "number" ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            res.status(400).json({ error: "Stock must be a non-negative integer" });
            return;
        }
        data.stock = stock;
    }

    if (categoryId !== undefined) {
        if (typeof categoryId !== "string" || !categoryId.trim()) {
            res.status(400).json({ error: "Category ID must be a non-empty string" });
            return;
        }
        data.categoryId = categoryId.trim();
    }

    if (Object.keys(data).length === 0) {
        res.status(400).json({ error: "No data provided for update" });
        return;
    }

    const updatedProduct = await updateProductService(id, userId, data);
    res.status(200).json(updatedProduct);
}


async function deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }

    if (!userId || typeof userId !== "string") {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    const deletedProduct = await deleteProductService(id, userId);
    res.json(deletedProduct);
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };