import {Router} from "express";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js";
import authMiddleware from "../auth/auth.middleware.js";
import { Role } from "../../generated/prisma/client.js";
import { createOrder, getOrders, getOrderById } from "../controllers/order.controller.js";


const router = Router();

router.get("/", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(getOrders))
router.get("/:id", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(getOrderById))
router.post("/", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(createOrder))

export default router;