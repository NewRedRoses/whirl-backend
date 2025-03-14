const { Router } = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");

const authRouter = Router();

const guestLoginMeter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50, // 50 req per ip for each 15 minutes
  message: "Too many guest requests, chill out man!!!",
});

const {
  googleCallback,
  checkSession,
  googLogOut,
  guestLoginCallback,
} = require("../controllers/authController.js");

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
);

authRouter.get("/google/callback", googleCallback);
authRouter.post("/google/logout", googLogOut);

authRouter.post("/guest", guestLoginMeter, guestLoginCallback);
authRouter.get("/check-session", checkSession);

module.exports = authRouter;
