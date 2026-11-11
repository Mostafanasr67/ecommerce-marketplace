import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js";
import authMiddleware from "../auth/auth.middleware.js";
import { Role } from "../../generated/prisma/client.js";
import multer from "multer";
import { uploadProductImageController, deleteProductImageController } from "../controllers/product.controller.js";
import AppError from "../utils/appError.js";
import type { RequestHandler } from "express";

const router = Router();
const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
            callback(new Error("Only JPEG, PNG, and WebP images are allowed."));
            return;
        } 
        callback(null, true);
    },
});
const parseImageUpload: RequestHandler = (req, res, next) => {
    imageUpload.single("image")(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            next(new AppError(error.code === "LIMIT_FILE_SIZE" ? "Image files must be 5 MB or smaller." : "Select one image file to upload.", error.code === "LIMIT_FILE_SIZE" ? 413 : 400));
            return;
        }
        if (error) {
            next(new AppError(error.message, 400));
            return;
        }
        next();
    });
};

router.get("/", asyncHandler(getAllProducts));
router.post("/images", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), parseImageUpload, asyncHandler(uploadProductImageController));
router.delete("/images", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), asyncHandler(deleteProductImageController));
router.get("/:id", asyncHandler(getProductById));
router.post("/", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), asyncHandler(createProduct));
router.patch("/:id", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), asyncHandler(updateProduct));
router.delete("/:id", asyncHandler(authMiddleware), roleMiddleware(Role.SELLER), asyncHandler(deleteProduct));

export default router;

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMmM2NjA4Ny03ZDE2LTRkOTgtOGU2My0yZTRhNDJjNGYwOTUiLCJpYXQiOjE3OTE4OTA5NTIsImV4cCI6MTc5MjQ5NTc1Mn0.8xYLoPP0ydlj8FSTh4j71jdTQDF4zP8-dA3paWvGJ7Y