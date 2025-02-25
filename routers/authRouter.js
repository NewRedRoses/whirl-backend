const { Router } = require("express");
const passport = require("passport");

const authRouter = Router();

const {
  googleCallback,
  checkSession,
} = require("../controllers/authController.js");

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
);

authRouter.get("/google/callback", googleCallback);
authRouter.get("/check-session", checkSession);

module.exports = authRouter;
