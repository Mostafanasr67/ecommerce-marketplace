import { Router } from "express";
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

    const token = createToken((req.user as any).id);
    res.json({
      message: "Google authentication successful",
      user: req.user,
      token,
    });
  }
);

export default router;