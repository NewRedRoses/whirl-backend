const { Router } = require("express");

const postRouter = Router();

const {
  getHomePagePosts,
  handleSubmitPost,
  getUserPosts,
  getPostById,
  handlePostLike,
  hasUserLikedPost,
  getPostComments,
  handlePostComment,
} = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);
postRouter.post("", handleSubmitPost);

postRouter.get("/id/:post_id", getPostById);

postRouter.get("/id/:post_id/like", hasUserLikedPost);
postRouter.post("/id/:post_id/like", handlePostLike);

postRouter.get("/id/:post_id/comments?", getPostComments);
postRouter.post("/id/:post_id/comments?", handlePostComment);

postRouter.get("/user/:username", getUserPosts);

module.exports = postRouter;
