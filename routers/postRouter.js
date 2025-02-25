const { Router } = require("express");

const postRouter = Router();

const {
  getHomePagePosts,
  getUserPosts,
} = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);
postRouter.get("/:user", getUserPosts);

module.exports = postRouter;
