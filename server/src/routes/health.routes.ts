import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";
import logger from "../middleware/logger.middleware.js";

const router = Router();

router.get("/", healthCheck);

export default router;