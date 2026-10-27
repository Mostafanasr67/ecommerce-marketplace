import { Router } from "express";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
} from "../controllers/cart.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { Role } from "../../generated/prisma/client.js";


const router = Router();


router.get("/", asyncHandler(authMiddleware), roleMiddleware(Role.USER) , asyncHandler(getCart)); // GET /cart
router.post("/add", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(addToCart)); // POST /cart/add
router.delete("/:productId", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(removeFromCart)); // DELETE /cart/:productId
router.patch("/:productId", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(updateCartItem)); // PATCH /cart/:productId
router.delete("/", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(clearCart)); // DELETE /cart

export default router;