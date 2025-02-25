const jwt = require("jsonwebtoken");

const { getPostsDesc, getAllUsersPosts } = require("../prisma/db.js");

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
      const posts = await getAllUsersPosts(authData.id);
      res.json(posts);
    } catch (err) {
      res.status(400).send("Unable to fetch posts. Please try again later.");
    }
  });
};

module.exports = { getHomePagePosts, getUserPosts };
