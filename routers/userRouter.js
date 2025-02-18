const { Router } = require("express");

const userRouter = Router();

const { getUserData } = require("../controllers/userController.js");

userRouter.get("/", getUserData);

module.exports = userRouter;
