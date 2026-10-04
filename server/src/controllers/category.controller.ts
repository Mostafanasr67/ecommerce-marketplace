import { getAllCategories } from "../services/category.service.js";
import type { Request, Response } from "express";

async function fetchAllCategories(_req: Request, res: Response) {
  const categories = await getAllCategories();
  res.json(categories);
}

export { fetchAllCategories };