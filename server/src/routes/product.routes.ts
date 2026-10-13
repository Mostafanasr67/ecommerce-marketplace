import { Router } from "express";
import { getAllProducts, getProductById } from "../controllers/product.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getAllProducts));
router.get("/:id", asyncHandler(getProductById));

export default router;