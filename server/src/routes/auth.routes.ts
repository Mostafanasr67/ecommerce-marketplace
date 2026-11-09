import { Router } from "express";
import { Role } from "../../generated/prisma/enums.js";
import passport from "../auth/passport.js";
import { createToken } from "../utils/jwt.js";
import authMiddleware from "../auth/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getUserById } from "../services/user.service.js";

const router = Router();

router.get("/me", asyncHandler(authMiddleware), asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await getUserById(req.user.id);
  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }
  const { id, email, name, phone, gender, dateOfBirth, role } = user;
  res.json({ id, email, name, phone, gender, dateOfBirth, role });
}));

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    if (!user) {
      res.status(401).send("Authentication failed");
      return;
    }

    const token = createToken(user.id);
    let path: string;

    switch (user.role) {
      case Role.SELLER:
        path = "/seller-dashboard";
        break;
      case Role.ADMIN:
        path = "/admin-dashboard";
        break;
      default:
        path = "/home";
    }

    const redirectUrl = new URL(path, "http://localhost:5173");
    redirectUrl.searchParams.append("token", token);
    redirectUrl.searchParams.append("user", JSON.stringify(user));

    res.redirect(redirectUrl.toString());
  }
);

export default router;