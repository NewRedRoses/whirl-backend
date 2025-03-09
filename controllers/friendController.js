const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const {
  addFriendsById,
  getUserDetailsByUsername,
  doesUserIdFollowUserId,
  removeFriendsById,
  getFriendshipRelationship,
} = require("../prisma/db.js");

const handleAddFriend = (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.SECRET, async (errors, authData) => {
    if (errors) {
      return res.sendStatus(401);
    }
    try {
      const userIdA = authData.user.id;

      const usernameB = req.body.content;
      const userB = await getUserDetailsByUsername(usernameB);

      const doesLoggedUserFollowProfileUser = await doesUserIdFollowUserId(
        userIdA,
        userB.id,
      );

      if (doesLoggedUserFollowProfileUser) {
        // Unfollow user
        const friendship = await getFriendshipRelationship(userIdA, userB.id);
        const removeFriendQuery = await removeFriendsById(friendship.id);
        res.end();
      } else {
        // Follow user
        const addFriendQuery = await addFriendsById(userIdA, userB.id);
        res.end();
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = { handleAddFriend };
