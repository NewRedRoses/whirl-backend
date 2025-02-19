const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const { getUserProfileByUserId } = require("../prisma/db.js");

const getUserProfile = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    try {
      if (errors) {
        return res.sendStatus(401);
      }
      const profileData = await getUserProfileByUserId(authData.id);
      res.json(profileData);
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = { getUserProfile };
