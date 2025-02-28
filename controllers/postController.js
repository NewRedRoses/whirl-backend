const jwt = require("jsonwebtoken");

const {
  getPostsDesc,
  getAllUsersPosts,
  createPost,
  getPostDetailsById,
  getPostLikeId,
  addLikeToPost,
  removeLikeFromPost,
} = require("../prisma/db.js");

const getHomePagePosts = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const posts = await getPostsDesc();
      res.json(posts);
    } catch (err) {
      res.status(400).send("Unable to fetch posts. Please try again later.");
    }
  });
};

const getProfilePosts = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const posts = await getAllUsersPosts(authData.user.id);
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
    const postId = req.params.post_id;

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

module.exports = {
  getHomePagePosts,
  getProfilePosts,
  handleSubmitPost,
  getPostById,
  handlePostLike,
};
