const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserProfileByUserId = async (userId) => {
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        userId: userId,
      },
      select: {
        displayName: true,
        pfpUrl: true,
        friendsCount: true,
      },
    });
    return profile;
  } catch (err) {
    console.log(err);
  }
};

const getPostsDesc = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      datePosted: "desc",
    },
    select: {
      id: true,
      userId: true,
      content: true,
      datePosted: true,
      likesNum: true,
      user: {
        select: {
          profile: true,
        },
      },
    },
  });
  return posts;
};

module.exports = { getUserProfileByUserId, getPostsDesc };
