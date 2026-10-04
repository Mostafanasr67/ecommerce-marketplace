import { getUserByEmail } from "../services/user.service.js";
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

export { fetchUserByEmail };