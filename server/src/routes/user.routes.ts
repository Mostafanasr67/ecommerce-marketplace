import { Router } from "express";
import { fetchUserByEmail } from "../controllers/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/:email", asyncHandler(fetchUserByEmail));

export default router;