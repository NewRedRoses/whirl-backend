const { Router } = require("express");

const postRouter = Router();

const {
  getHomePagePosts,
  handleSubmitPost,
  getProfilePosts,
  getPostById,
  handlePostLike,
  hasUserLikedPost,
  getPostComments,
} = require("../controllers/postController.js");

postRouter.get("", getHomePagePosts);
postRouter.post("", handleSubmitPost);

postRouter.get("/id/:post_id", getPostById);

postRouter.get("/id/:post_id/like", hasUserLikedPost);
postRouter.post("/id/:post_id/like", handlePostLike);

postRouter.get("/id/:post_id/comments?", getPostComments);
// postRouter.post("/id/:post_id/comments?", handlePostComment );

postRouter.get("/profile", getProfilePosts);

module.exports = postRouter;
