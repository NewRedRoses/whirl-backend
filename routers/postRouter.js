const { Router } = require("express");

const postRouter = Router();

const {
  getHomePagePosts,
  getUserPosts,
  handleSubmitPost,
  getProfilePosts,
} = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);
postRouter.post("", handleSubmitPost);

postRouter.get("/:user", getUserPosts);
postRouter.get("/profile", getProfilePosts);

module.exports = postRouter;
