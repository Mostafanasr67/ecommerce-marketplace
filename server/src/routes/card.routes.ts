import { Router } from "express";
import {
    getAllCards,
    createCard,
    deleteCard,
    setDefaultCard
} from "../controllers/card.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js";
import authMiddleware from "../auth/auth.middleware.js";
import { Role } from "../../generated/prisma/client.js";

const router = Router();

router.get('', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(getAllCards));
router.post('', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(createCard));
router.patch('/:id/default', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(setDefaultCard));
router.delete('/:id', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(deleteCard));

export default router;
