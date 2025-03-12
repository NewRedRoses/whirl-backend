const jwt = require("jsonwebtoken");

const {
  getPostsDesc,
  getAllUsersPosts,
  createPost,
  getPostDetailsById,
  getPostLikeId,
  addLikeToPost,
  removeLikeFromPost,
  getCommentsFromPostId,
  addCommentToPost,
  getUserDetailsByUsername,
} = require("../prisma/db.js");

const getHomePagePosts = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const loggedInUserId = authData.user.id;
      const fetchedPosts = await getPostsDesc(loggedInUserId);
      res.json(fetchedPosts);
    } catch (err) {
      res.status(400).send("Unable to fetch posts. Please try again later.");
    }
  });
};

const getUserPosts = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const username = req.params.username;
      const user = await getUserDetailsByUsername(username);

      const posts = await getAllUsersPosts(user.id);
      res.json(posts);
    } catch (err) {
      res.status(400).send("Unable to fetch posts. Please try again later.");
    }
  });
};

const handleSubmitPost = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      if (req.body.content != "" && req.body.content != undefined) {
        await createPost(authData.user.id, req.body.content);
        res.sendStatus(200);
      } else {
        res.status(400).send("Post's content cannot be empty.");
      }
    } catch (err) {
      res.status(400).send("Unable to submit post. Please try again later.");
    }
  });
};

const getPostById = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    const postId = parseInt(req.params.post_id);

    const postDetails = await getPostDetailsById(postId);

    if (postDetails) {
      res.json(postDetails);
    } else {
      res.json({ error: "Post not found!" });
    }
  });
};

const handlePostLike = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    const postId = parseInt(req.params.post_id);
    const userId = authData.user.id;

    const isPostLiked = await getPostLikeId(postId, userId);

    if (isPostLiked) {
      const postLikeRemoved = await removeLikeFromPost(postId, userId);

      postLikeRemoved
        ? res.status(200).send("Post like removed successfully.")
        : res.status(400).send("Unable to remove like from post.");
    } else {
      const postLiked = await addLikeToPost(postId, userId);

      postLiked
        ? res.status(200).send("Post liked successfully.")
        : res.status(400).send("Unable to like post.");
    }

    res.end();

    try {
    } catch (err) {
      res.status(400).send("Unable to like post. Please try again later.");
    }
  });
};

const hasUserLikedPost = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const postId = parseInt(req.params.post_id);
      const userId = authData.user.id;

      const isPostLiked = await getPostLikeId(postId, userId);

      if (isPostLiked) {
        res.json({ success: "Post is liked by user" });
      } else {
        res.json({ error: "Post is not liked by user" });
      }
    } catch (err) {
      res
        .status(500)
        .send("Unable to get post like status. Please try again later.");
    }
  });
};

const getPostComments = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const postId = parseInt(req.params.post_id);
      const comments = await getCommentsFromPostId(postId);
      res.json(comments);
    } catch (err) {
      console.log(err);
    }
  });
};

const handlePostComment = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const postId = parseInt(req.params.post_id);
      const userId = authData.user.id;
      const content = req.body.content;

      const response = await addCommentToPost(postId, userId, content);

      if (response) {
        res.status(200).json({ success: "comment added successfully" });
      } else {
        res.status(500).json({ error: "Unable to add comment." });
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  getHomePagePosts,
  getUserPosts,
  handleSubmitPost,
  getPostById,
  handlePostLike,
  hasUserLikedPost,
  getPostComments,
  handlePostComment,
};
