const { Router } = require("express");
const friendRouter = Router();

const { handleAddFriend } = require("../controllers/friendController.js");

friendRouter.post("/add", handleAddFriend);

module.exports = friendRouter;
