import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getUserByEmail, createUser } from "../services/user.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email not found"));
        }

        const user = await getUserByEmail(email);

        if (!user) {
          const newUser = await createUser(email, profile.displayName || null);
          return done(null, newUser);
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;