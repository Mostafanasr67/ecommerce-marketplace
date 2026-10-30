import { Router } from "express";
import {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from "../controllers/address.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js";
import authMiddleware from "../auth/auth.middleware.js";
import { Role } from "../../generated/prisma/client.js";

const router = Router();

router.get('', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(getAllAddresses));
router.get('/:id', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(getAddressById));
router.post('', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(createAddress));
router.patch('/:id', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(updateAddress));
router.patch('/:id/default', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(setDefaultAddress));
router.delete('/:id', asyncHandler(authMiddleware), roleMiddleware(Role.USER), asyncHandler(deleteAddress));

export default router;