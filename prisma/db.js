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
        bio: true,
        user: {
          select: {
            username: true,
            dateJoined: true,
          },
        },
      },
    });

    const flattenedProfile = { ...profile, ...profile.user };
    return flattenedProfile;
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

const getAllUsersPosts = async (id) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: id,
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
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getUserProfileByUserId, getPostsDesc, getAllUsersPosts };
