import { Router } from "express";
import {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { Role } from "../../generated/prisma/client.js";

const router = Router();

router.get("/", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(getWishlist)); // GET /wishlist
router.post("/add", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(addToWishlist)); // POST /wishlist/add
router.delete("/:productId", asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(removeFromWishlist)); // DELETE /wishlist/:productId

export default router;
