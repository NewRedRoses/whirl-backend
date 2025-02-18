const { Router } = require("express");
const passport = require("passport");

const authRouter = Router();

const { googleCallback } = require("../controllers/authController.js");

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
);

authRouter.get("/google/callback", googleCallback);

module.exports = authRouter;
