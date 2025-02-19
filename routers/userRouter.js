const { Router } = require("express");

const userRouter = Router();

const { getUserData } = require("../controllers/userController.js");
const { getUserProfile } = require("../controllers/userController.js");

userRouter.get("/", getUserData);
userRouter.get("/", getUserProfile);

module.exports = userRouter;
