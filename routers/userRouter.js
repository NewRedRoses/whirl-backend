const { Router } = require("express");

const userRouter = Router();

const { getUserProfile } = require("../controllers/userController.js");

userRouter.get("/", getUserProfile);

module.exports = userRouter;
