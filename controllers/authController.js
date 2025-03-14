const jwt = require("jsonwebtoken");
const { generateUsername } = require("unique-username-generator");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { faker } = require("@faker-js/faker");
const rateLimit = require("express-rate-limit");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: process.env["GOOGLE_REDIRECT_URL"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let googlePfpUrl = profile.photos[0].value;
      googlePfpUrl = googlePfpUrl.slice(0, -2);

      const user = await prisma.user.findUnique({
        where: {
          googleId: profile.id,
        },
        select: {
          id: true,
          name: true,
          dateJoined: true,
          username: true,
        },
      });
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            name: profile.displayName,
            username: generateUsername(),
          },
        });
        // Create matching profile for the user
        await prisma.profile.create({
          data: {
            userId: newUser.id,
            displayName: profile.displayName,
            pfpUrl: googlePfpUrl,
          },
        });
        done(null, newUser);
      } else {
        return done(null, user);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (username == "guest" && password == "guest") {
        const user = await prisma.user.findFirst({
          where: {
            role: "guest",
          },
        });
        return done(null, user);
      }
      return done(null, false, { message: "Incorrect info for guest!" });
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Get user ID from db that matches arg id set it ‘user’
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.sendStatus(404);
    }
    // Login successful
    jwt.sign(
      { user },
      process.env.SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=server_error`,
          );
        }
        // res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV == "dev" ? false : true,
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
          // maxAge: 1000 * 6 * 60,
        });

        // redirect
        res.redirect(`${process.env.FRONTEND_URL}/`);
      },
    );
  })(req, res, next);
};

const googLogOut = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // log out user
    res.cookie("jwt", "none", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully." });
  });
};

const checkSession = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return res.status(200).json({ message: "Authenticated" });
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

const guestLoginCallback = (req, res, next) => {
  passport.authenticate("local", (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ error: "Guest login failed." });
    }

    jwt.sign(
      { user },
      process.env.SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) {
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=server_error`,
          );
        }
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV == "dev" ? false : true,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // redirect
        res.redirect(`${process.env.FRONTEND_URL}/`);
      },
    );
  })(req, res, next);
};

module.exports = {
  googleCallback,
  googLogOut,
  checkSession,
  guestLoginCallback,
};
