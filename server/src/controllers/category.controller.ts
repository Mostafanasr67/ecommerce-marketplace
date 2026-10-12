import { getAllCategories, createCategory as createCategoryService, updateCategory as updateCategoryService, deleteCategory as deleteCategoryService } from "../services/category.service.js";
import type { Request, Response } from "express";

async function fetchAllCategories(_req: Request, res: Response) {
  const categories = await getAllCategories();
  res.json(categories);
}

async function createCategory(req: Request, res: Response) {
  const {name} = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Name is required and must be a non-empty string" });
  }

  const newCategory = await createCategoryService(name.trim());
  res.status(201).json(newCategory);
}

async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Name is required and must be a non-empty string" });
  }

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ error: "ID is required and must be a non-empty string" });
  }

  const updatedCategory = await updateCategoryService(id, name.trim());
  res.json(updatedCategory);
}

async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ error: "ID is required and must be a non-empty string" });
  }

  const deletedCategory = await deleteCategoryService(id);
  res.json(deletedCategory);
}

export { fetchAllCategories, createCategory, updateCategory, deleteCategory };