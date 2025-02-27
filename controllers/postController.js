const jwt = require("jsonwebtoken");

const {
  getPostsDesc,
  getAllUsersPosts,
  createPost,
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

const getUserPosts = (req, res) => {
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

module.exports = { getHomePagePosts, getUserPosts, handleSubmitPost };
