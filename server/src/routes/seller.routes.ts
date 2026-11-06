import { Router } from "express";
import authMiddleware from "../auth/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Role } from "../../generated/prisma/enums.js";
import { getSellerbyId, getSellerProductsBySellerId, getSellerOrdersBySellerId } from "../controllers/seller.controller.js";

const router = Router();

router.use(asyncHandler(authMiddleware), roleMiddleware(Role.SELLER));
router.get("/:sellerId", asyncHandler(getSellerbyId));
router.get("/:sellerId/products", asyncHandler(getSellerProductsBySellerId));
router.get("/:sellerId/orders", asyncHandler(getSellerOrdersBySellerId));


export default router;