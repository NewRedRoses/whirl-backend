const { Router } = require("express");

const postRouter = Router();

const {
  getHomePagePosts,
  handleSubmitPost,
  getProfilePosts,
  getPostById,
} = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);
postRouter.post("", handleSubmitPost);

postRouter.get("/id/:post_id", getPostById);
postRouter.get("/profile", getProfilePosts);

module.exports = postRouter;
