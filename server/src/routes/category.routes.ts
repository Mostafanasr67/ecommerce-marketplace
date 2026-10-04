import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchAllCategories } from "../controllers/category.controller.js";

const router = Router();

router.get("/", asyncHandler(fetchAllCategories));

export default router;