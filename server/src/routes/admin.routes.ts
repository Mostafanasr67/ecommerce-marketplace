import { Router } from "express";
import { Role } from "../../generated/prisma/enums.js";
import authMiddleware from "../auth/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchAdminOverview, fetchAdminUsers, fetchAdminSellers, fetchAdminProducts, fetchAdminCategories, fetchAdminOrders, fetchAdminFilterOptions, changeAdminOrderStatus } from "../controllers/admin.controller.js";

const router = Router();

router.use(asyncHandler(authMiddleware), roleMiddleware(Role.ADMIN));
router.get("/overview", asyncHandler(fetchAdminOverview));
router.get("/users", asyncHandler(fetchAdminUsers));
router.get("/sellers", asyncHandler(fetchAdminSellers));
router.get("/products", asyncHandler(fetchAdminProducts));
router.get("/categories", asyncHandler(fetchAdminCategories));
router.get("/orders", asyncHandler(fetchAdminOrders));
router.patch("/orders/:orderId/status", asyncHandler(changeAdminOrderStatus));
router.get("/filter-options", asyncHandler(fetchAdminFilterOptions));

export default router;
