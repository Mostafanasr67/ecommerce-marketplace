import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { getUserById } from "../services/user.service.js";

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const user = await getUserById(decoded.userId);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;

  next();
}

export default authMiddleware;