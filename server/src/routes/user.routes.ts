import { Router } from "express";
import { fetchUserByEmail, fetchUserProfile, updateProfile } from "../controllers/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router.get("/profile/me", asyncHandler(authMiddleware), asyncHandler(fetchUserProfile));
router.put("/profile/update", asyncHandler(authMiddleware), asyncHandler(updateProfile));
router.get("/:email", asyncHandler(authMiddleware), asyncHandler(fetchUserByEmail));

export default router;