const { Router } = require("express");

const userRouter = Router();

const {
  getUserProfile,
  getUserPfp,
  getAllUserProfiles,
} = require("../controllers/userController.js");

userRouter.get("/", getAllUserProfiles);
userRouter.get("/profile/:username", getUserProfile); // new
userRouter.get("/pfp", getUserPfp);

module.exports = userRouter;
