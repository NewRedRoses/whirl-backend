const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserProfileByUserId = async (userId) => {
  try {
    const profile = await prisma.profile.findUnique({
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

const createPost = async (userId, content) => {
  try {
    await prisma.post.create({
      data: {
        userId: userId,
        content: content,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getPostDetailsById = async (postId) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId),
      },
    });
    if (post) {
      return post;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};

const getPostLikeId = async (postId, userId) => {
  try {
    const post = await prisma.postLike.findFirst({
      where: {
        AND: [
          {
            postId: {
              equals: postId,
            },
          },
          {
            userId: {
              equals: userId,
            },
          },
        ],
      },
    });
    return post;
  } catch (error) {
    console.log(error);
  }
};

const addLikeToPost = async (postId, userId) => {
  try {
    const post = await prisma.postLike.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
    return post;
  } catch (error) {
    console.log(error);
  }
};

const removeLikeFromPost = async (postId, userId) => {
  try {
    const rowToDelete = await getPostLikeId(postId, userId);

    const postLikeRemoved = await prisma.postLike.delete({
      where: {
        id: rowToDelete.id,
      },
    });
    return postLikeRemoved;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserProfileByUserId,
  getPostsDesc,
  getAllUsersPosts,
  createPost,
  getPostDetailsById,
  getPostLikeId,
  addLikeToPost,
  removeLikeFromPost,
};
