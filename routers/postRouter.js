const { Router } = require("express");

const postRouter = Router();

const {
  getHomePagePosts,
  handleSubmitPost,
  getProfilePosts,
  getPostById,
  handlePostLike,
} = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);
postRouter.post("", handleSubmitPost);

postRouter.get("/id/:post_id", getPostById);
postRouter.post("/id/:post_id/like", handlePostLike);
postRouter.get("/profile", getProfilePosts);

module.exports = postRouter;
