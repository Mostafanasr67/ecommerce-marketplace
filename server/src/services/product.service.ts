import prisma from "../prisma.js";
import AppError from "../utils/appError.js";

interface ProductFilters {
    search?: string;
    categoryId?: string;
    categoryIds?: string[];
    excludeProductIds?: string[];
    sellerId?: string;
    sortBy?: "name" | "price" | "createdAt";
    sortOrder?: "asc" | "desc";
}

async function getAllProducts(limit: number, page: number, filters: ProductFilters) {
    const where = {
        ...(filters.search ? { name: { contains: filters.search, mode: "insensitive" as const } } : {}),
        ...(filters.categoryIds?.length
            ? { categoryId: { in: filters.categoryIds } }
            : filters.categoryId
                ? { categoryId: filters.categoryId }
                : {}),
        ...(filters.excludeProductIds?.length
            ? { id: { notIn: filters.excludeProductIds } }
            : {}),
        ...(filters.sellerId ? { sellerId: filters.sellerId } : {})
    };

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            take: limit,
            skip: (page - 1) * limit,
            where,
            ...(filters.sortBy ? { orderBy: { [filters.sortBy]: filters.sortOrder || "asc" } } : {}),
            include: {
                seller: { select: { storeName: true } },
                productImages: { orderBy: { sortOrder: "asc" } },
            },
        }),
        prisma.product.count({
            where
        })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return { products, totalCount, totalPages };
}

function getProductById(id: string) {
    return prisma.product.findUnique({
        where: { id }
    });
}

async function createProduct(
    name: string,
    description: string | null,
    price: number,
    stock: number,
    categoryId: string,
    userId: string,
    discountType: "PERCENT" | "FIXED" | null = null,
    discountValue: number | null = null,
) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { seller: true }
    });

    if (!user?.seller) {
        throw new AppError("Seller profile not found", 403);
    }

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
    });
    if (!category) throw new AppError("Selected category was not found. Choose an existing category.", 400);

    return prisma.product.create({
        data: {
            "name": name,
            "description": description,
            "price": price,
            "stock": stock,
            "categoryId": categoryId,
            "sellerId": user.seller.id,
            "discountType": discountType,
            "discountValue": discountValue,
        }
    });
}

interface UpdateProductData {
    name?: string;
    description?: string | null;
    price?: number;
    stock?: number;
    categoryId?: string;
}

async function updateProduct(id: string, userId: string, data: UpdateProductData) {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { seller: true }
    });

    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    if (!user?.seller) {
        throw new Error("User must be a seller to update products");
    }

    if (product.sellerId !== user.seller.id) {
        throw new Error("User can only update their own products");
    }

    if (data.price !== undefined && product.discountType === "FIXED" && product.discountValue && product.discountValue.greaterThanOrEqualTo(data.price)) {
        throw new AppError("Price must exceed the fixed discount", 400);
    }

    if (Object.keys(data).length === 0) {
        throw new Error("No data provided for update");
    }

    return prisma.product.update({
        where: { id },
        data: {
            ...data
        }
    });
}

async function deleteProduct(id: string, userId: string) {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { seller: true }
    });

    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    if (!user?.seller) {
        throw new Error("User must be a seller to delete products");
    }

    if (product.sellerId !== user.seller.id) {
        throw new Error("User can only delete their own products");
    }

    return prisma.product.delete({
        where: { id }
    });
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
export type { UpdateProductData, ProductFilters };