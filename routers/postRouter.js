const { Router } = require("express");

const postRouter = Router();

const { getHomePagePosts } = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);

module.exports = postRouter;
