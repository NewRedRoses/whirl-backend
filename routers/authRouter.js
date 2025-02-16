const { Router } = require("express");
const authRouter = Router();
const jwt = require("jsonwebtoken");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: process.env["GOOGLE_REDIRECT_URL"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await prisma.user.findFirst({
        where: {
          googleId: profile.id,
        },
      });
      if (!user) {
        await prisma.user.create({
          data: {
            googleId: profile.id,
            name: profile.displayName,
          },
        });
        done(null, user);
      } else {
        return done(null, user);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Get user ID from db that matches arg id set it ‘user’
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
);

authRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.sendStatus(404);
    }
    // Login successful
    jwt.sign({ user }, process.env.SECRET, (err, token) => {
      if (err) {
        res.sendStatus(500);
      }
      res.json({
        status: 200,
        token,
      });
    });
  })(req, res, next);
});

module.exports = authRouter;
