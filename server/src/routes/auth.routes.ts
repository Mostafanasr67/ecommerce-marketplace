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
    const user = req.user as any;
    
    const redirectUrl = new URL("http://localhost:5173");
    redirectUrl.searchParams.append("token", token);
    redirectUrl.searchParams.append("user", JSON.stringify(user));
    
    res.redirect(redirectUrl.toString());
  }
);

export default router;