import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchAllCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { Role } from "../../generated/prisma/client.js";

const router = Router();

router.get("/", asyncHandler(fetchAllCategories));
router.post("/", asyncHandler(authMiddleware), roleMiddleware(Role.ADMIN), asyncHandler(createCategory));
router.patch("/:id", asyncHandler(authMiddleware), roleMiddleware(Role.ADMIN), asyncHandler(updateCategory));
router.delete("/:id", asyncHandler(authMiddleware), roleMiddleware(Role.ADMIN), asyncHandler(deleteCategory));

export default router;