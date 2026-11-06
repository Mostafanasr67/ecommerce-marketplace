import { Router } from "express";
import { Role } from "../../generated/prisma/enums.js";
import passport from "../auth/passport.js";
import { createToken } from "../utils/jwt.js";

const router = Router();

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