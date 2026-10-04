import { Router } from "express";
import passport from "../auth/passport.js";

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
    res.json({
      message: "Google authentication successful",
      user: req.user,
    });
  }
);

export default router;