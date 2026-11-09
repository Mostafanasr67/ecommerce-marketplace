import type { Request, Response } from "express";
import type { UpdateProductData, ProductFilters } from "../services/product.service.js";
import { getAllProducts as getAllProductsService, getProductById as getProductByIdService, createProduct as createProductService, updateProduct as updateProductService, deleteProduct as deleteProductService } from "../services/product.service.js";
import { customerProduct } from "../utils/productPricing.js";

async function getAllProducts(req: Request, res: Response) {

    const limitQuery = req.query.limit || 10;
    const pageQuery = req.query.page || 1;
    const search = req.query.search;
    const categoryId = req.query.categoryId;
    const categoryIdsQuery = req.query.categoryIds;
    const excludeProductIdsQuery = req.query.excludeProductIds;
    const sellerId = req.query.sellerId;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;



    const limit = Number(limitQuery);
    const page = Number(pageQuery);

    if (limit <= 0 || page <= 0 || !Number.isInteger(limit) || !Number.isInteger(page)) {
        res.status(400).json({ error: "Limit and page must be positive integers" });
        return;
    }

    if (search !== undefined && typeof search !== "string" || categoryId !== undefined && typeof categoryId !== "string" || categoryIdsQuery !== undefined && typeof categoryIdsQuery !== "string" || excludeProductIdsQuery !== undefined && typeof excludeProductIdsQuery !== "string" || sellerId !== undefined && typeof sellerId !== "string") {
        res.status(400).json({ error: "Search, categoryId, categoryIds, excludeProductIds, and sellerId must be strings" });
        return;
    }

    if (sortBy !== undefined && typeof sortBy !== "string") {
        res.status(400).json({ error: "sortBy must be 'name', 'price', or 'createdAt'" });
        return;
    }

    if (sortBy !== undefined && sortBy !== "name" && sortBy !== "price" && sortBy !== "createdAt") {
        res.status(400).json({ error: "sortBy must be 'name', 'price', or 'createdAt'" });
        return;
    }

    if (sortOrder !== undefined && typeof sortOrder !== "string") {
        res.status(400).json({ error: "sortOrder must be 'asc' or 'desc'" });
        return;
    }

    if (sortOrder !== undefined && sortOrder !== "asc" && sortOrder !== "desc") {
        res.status(400).json({ error: "sortOrder must be 'asc' or 'desc'" });
        return;
    }

    const categoryIds = typeof categoryIdsQuery === "string"
        ? [...new Set(categoryIdsQuery.split(",").map((id) => id.trim()).filter(Boolean))]
        : undefined;
    const excludeProductIds = typeof excludeProductIdsQuery === "string"
        ? [...new Set(excludeProductIdsQuery.split(",").map((id) => id.trim()).filter(Boolean))]
        : undefined;
    if (categoryIdsQuery !== undefined && categoryIds?.length === 0) {
        res.status(400).json({ error: "categoryIds must include at least one category ID" });
        return;
    }

    const filters: ProductFilters = {
        ...(search ? { search } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(categoryIds ? { categoryIds } : {}),
        ...(excludeProductIds ? { excludeProductIds } : {}),
        ...(sellerId ? { sellerId } : {}),
        ...(sortBy ? { sortBy } : {}),
        ...(sortOrder ? { sortOrder } : {}),
    };

    const response = await getAllProductsService(limit, page, filters);
    res.json({ products: response.products.map(customerProduct), pagination: { page, limit, totalCount: response.totalCount, totalPages: response.totalPages } });
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

    res.json(customerProduct(product));
}

async function createProduct(req: Request, res: Response) {
    const { name, description, price, stock, categoryId, discountType, discountValue } = req.body;
    const userId = req.user?.id;
    const normalizedDiscountType = discountType ?? null;
    const normalizedDiscountValue = discountValue ?? null;
    const validMoney = (value: unknown): value is number =>
        typeof value === "number" &&
        Number.isFinite(value) &&
        value > 0 &&
        value <= 1000000000 &&
        Number.isSafeInteger(Math.round(value * 100)) &&
        Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        (description !== undefined &&
            description !== null &&
            typeof description !== "string") ||
        typeof price !== "number" ||
        !validMoney(price) ||
        typeof stock !== "number" ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        stock > 2147483647 ||
        typeof categoryId !== "string" ||
        !categoryId.trim() ||
        (normalizedDiscountType !== null && normalizedDiscountType !== "PERCENT" && normalizedDiscountType !== "FIXED") ||
        (normalizedDiscountType === null && normalizedDiscountValue !== null) ||
        (normalizedDiscountType !== null &&
            (!validMoney(normalizedDiscountValue) ||
                normalizedDiscountValue >= (normalizedDiscountType === "PERCENT" ? 100 : price))) ||
        typeof userId !== "string" ||
        !userId
    ) {
        res.status(400).json({ error: "Missing required fields or Incorrect types" });
        return;
    }


    const product = await createProductService(
        name.trim(),
        description ?? null,
        price,
        stock,
        categoryId.trim(),
        userId,
        normalizedDiscountType,
        normalizedDiscountValue,
    );
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