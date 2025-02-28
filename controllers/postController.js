const jwt = require("jsonwebtoken");

const {
  getPostsDesc,
  getAllUsersPosts,
  createPost,
  getPostDetailsById,
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

module.exports = {
  getHomePagePosts,
  getProfilePosts,
  handleSubmitPost,
  getPostById,
};
