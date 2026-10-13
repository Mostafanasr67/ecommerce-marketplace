import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js";
import authMiddleware from "../auth/auth.middleware.js";
import { Role } from "../../generated/prisma/client.js";

const router = Router();

router.get("/", asyncHandler(getAllProducts));
router.get("/:id", asyncHandler(getProductById));
router.post("/", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), asyncHandler(createProduct));
router.patch("/:id", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), asyncHandler(updateProduct));
router.delete("/:id", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), asyncHandler(deleteProduct));

export default router;

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMmM2NjA4Ny03ZDE2LTRkOTgtOGU2My0yZTRhNDJjNGYwOTUiLCJpYXQiOjE3OTE4OTA5NTIsImV4cCI6MTc5MjQ5NTc1Mn0.8xYLoPP0ydlj8FSTh4j71jdTQDF4zP8-dA3paWvGJ7Y