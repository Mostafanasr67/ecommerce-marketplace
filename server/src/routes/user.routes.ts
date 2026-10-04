import { Router } from "express";
import { fetchUserByEmail } from "../controllers/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router.get("/:email", asyncHandler(authMiddleware), asyncHandler(fetchUserByEmail));

export default router;