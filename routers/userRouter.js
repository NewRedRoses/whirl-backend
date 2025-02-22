const { Router } = require("express");

const userRouter = Router();

const {
  getUserProfile,
  getUserPfp,
} = require("../controllers/userController.js");

userRouter.get("/", getUserProfile);
userRouter.get("/pfp", getUserPfp);

module.exports = userRouter;
