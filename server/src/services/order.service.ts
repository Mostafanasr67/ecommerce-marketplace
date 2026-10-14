import prisma from "../prisma.js";

async function createOrder(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a positive integer");
    }

    return await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.stock < quantity) {
            throw new Error("Insufficient stock");
        }

        const productUpdate = await tx.product.updateMany(
            {
                where: { id: productId, stock: { gte: quantity } },
                data: { stock: { decrement: quantity } }
            }
        );

        if (productUpdate.count <= 0) {
            throw new Error("Insufficient stock or product not found");
        }

        return productUpdate;

    });
}