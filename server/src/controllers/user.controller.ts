import { getUserByEmail, getUserById, updateUserProfile } from "../services/user.service.js";
import type { Request, Response } from "express";

async function fetchUserByEmail(req: Request, res: Response) {
    const { email } = req.params;
    if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
}

async function fetchUserProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
}

async function updateProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, phone, gender, dateOfBirth } = req.body;

    const updatedUser = await updateUserProfile(userId, {
        ...(name !== undefined && { name: name || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(gender !== undefined && { gender: gender || null }),
        ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
    });

    res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
    });
}

export { fetchUserByEmail, fetchUserProfile, updateProfile };