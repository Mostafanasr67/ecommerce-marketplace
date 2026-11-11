import { Router } from "express";
import authMiddleware from "../auth/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Role } from "../../generated/prisma/enums.js";
import { getSellerbyId, updateSellerStoreNameById, getSellerProductsBySellerId, getSellerOrdersBySellerId, updateSellerOrderStatusById, updateSellerProductStockById, updateSellerProductDetailsById, updateSellerProductImagesById } from "../controllers/seller.controller.js";

const router = Router();

router.use(asyncHandler(authMiddleware), roleMiddleware(Role.SELLER));
router.get("/:sellerId", asyncHandler(getSellerbyId));
router.patch("/:sellerId", asyncHandler(updateSellerStoreNameById));
router.get("/:sellerId/products", asyncHandler(getSellerProductsBySellerId));
router.patch("/:sellerId/products/:productId/stock", asyncHandler(updateSellerProductStockById));
router.patch("/:sellerId/products/:productId/details", asyncHandler(updateSellerProductDetailsById));
router.patch("/:sellerId/products/:productId/images", asyncHandler(updateSellerProductImagesById));
router.get("/:sellerId/orders", asyncHandler(getSellerOrdersBySellerId));
router.patch("/:sellerId/orders/:orderId/status", asyncHandler(updateSellerOrderStatusById));


export default router;