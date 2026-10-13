import prisma from "../prisma.js";
import AppError from "../utils/appError.js";


function getAllProducts() {
    return prisma.product.findMany();
}

function getProductById(id: string) {
    return prisma.product.findUnique({
        where: { id }
    });
}

async function createProduct(name: string, description: string | null, price: number, stock: number, categoryId: string, userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { seller: true }
    });

    if (!user?.seller) {
        throw new Error("User must be a seller to create products");
    }

    return prisma.product.create({
        data: {
            "name": name,
            "description": description,
            "price": price,
            "stock": stock,
            "categoryId": categoryId,
            "sellerId": user.seller.id
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
export type { UpdateProductData };