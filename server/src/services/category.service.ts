import prisma from "../prisma.js";

function getAllCategories() {
  return prisma.category.findMany();
}

export { getAllCategories };