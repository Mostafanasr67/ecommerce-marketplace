import { Router } from "express";
import { Role } from "../../generated/prisma/enums.js";
import authMiddleware from "../auth/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchProductReviews, fetchMyProductReview, saveProductReview } from "../controllers/review.controller.js";

const router = Router();

router.get("/:productId", asyncHandler(fetchProductReviews));
router.get("/:productId/mine", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(fetchMyProductReview));
router.put("/:productId", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(saveProductReview));

export default router;
