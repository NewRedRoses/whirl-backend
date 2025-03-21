const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const {
  getUserProfileByUserId,
  getUserDetailsByUsername,
  doesUserIdFollowUserId,
} = require("../prisma/db.js");

const getUserProfile = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    try {
      if (errors) {
        return res.sendStatus(401);
      }
      const username = req.params.username;
      const user = await getUserDetailsByUsername(username);

      if (user) {
        const profileData = await getUserProfileByUserId(user.id);
        if (authData.user.id != user.id) {
          // make a query to determine if user follows you
          const doesUserFollowLoggedUser = await doesUserIdFollowUserId(
            user.id,
            authData.user.id,
          );
          // Alternatively, do a query to determine if you follow the user
          const doesLoggedUserFollowUser = await doesUserIdFollowUserId(
            authData.user.id,
            user.id,
          );
          return res.json({
            profileData,
            doesLoggedUserFollowUser,
            doesUserFollowLoggedUser,
          });
        } else res.json({ profileData });
      } else {
        res.status(404).json({ error: "User does not exist" });
      }
    } catch (err) {
      console.log(err);
    }
  });
};

const getUserPfp = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    try {
      if (errors) {
        return res.sendStatus(401);
      }
      const userPfp = await prisma.profile.findUnique({
        where: {
          userId: authData.user.id,
        },
        select: {
          pfpUrl: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      res.json(userPfp);
    } catch (err) {
      console.log(err);
    }
  });
};

const getAllUserProfiles = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    try {
      if (errors) {
        return res.sendStatus(401);
      }
      const allUsers = await prisma.profile.findMany({
        select: {
          pfpUrl: true,
          friendsCount: true,
          displayName: true,
          user: {
            select: {
              username: true,
              _count: {
                select: {
                  friendOf: true,
                  friendsA: true,
                  friendsB: true,
                },
              },
            },
          },
        },
      });
      res.json(allUsers);
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  getUserProfile,
  getUserPfp,
  getAllUserProfiles,
};
