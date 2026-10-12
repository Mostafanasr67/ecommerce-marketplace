import prisma from "../prisma.js";

function getAllCategories() {
  return prisma.category.findMany();
}

function createCategory(name: string) {
  return prisma.category.create({
    data: {
      name,
    },
  });
}

function updateCategory(id: string, name: string) {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
}

function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}

export { getAllCategories, createCategory, updateCategory, deleteCategory };