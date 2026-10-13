import prisma from "../prisma.js";

function getAllProducts() {
    return prisma.product.findMany();
}

function getProductById(id: string) {
    return prisma.product.findUnique({
        where: { id }
    });
}

export { getAllProducts, getProductById };