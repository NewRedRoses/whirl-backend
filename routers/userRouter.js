const { Router } = require("express");

const userRouter = Router();

const {
  getUserProfile,
  getUserPfp,
  getAllUserProfiles,
} = require("../controllers/userController.js");

userRouter.get("/", getAllUserProfiles);
userRouter.get("/profile", getUserProfile);
userRouter.get("/pfp", getUserPfp);

module.exports = userRouter;
