const { Router } = require("express");

const postRouter = Router();

const {
  getHomePagePosts,
  getUserPosts,
  handleSubmitPost,
} = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);
postRouter.post("", handleSubmitPost);

postRouter.get("/:user", getUserPosts);

module.exports = postRouter;
