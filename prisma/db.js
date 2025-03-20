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
            role: true,
            _count: {
              select: {
                friendsA: true,
                friendsB: true,
              },
            },
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

const getAllPosts = async (loggedInUserId) => {
  try {
    let allPosts = await prisma.post.findMany({
      orderBy: {
        datePosted: "desc",
      },
      select: {
        id: true,
        content: true,
        datePosted: true,
        user: {
          select: {
            username: true,
            profile: {
              select: {
                displayName: true,
                pfpUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            postComment: true,
            postLike: true,
          },
        },
        postLike: {
          where: {
            userId: loggedInUserId,
          },
          select: {
            id: true,
          },
        },
      },
    });
    return allPosts.map((post) => ({
      ...post,
      hasLiked: post.postLike.length > 0,
    }));
  } catch (error) {
    console.log(error);
  }
};

const getPostsDesc = async (loggedInUserId) => {
  let postsObject = await prisma.userFriend.findMany({
    where: {
      userIdA: loggedInUserId,
    },
    select: {
      userB: {
        select: {
          username: true,
          post: {
            orderBy: {
              datePosted: "desc",
            },
            select: {
              id: true,
              content: true,
              datePosted: true,
              user: {
                select: {
                  username: true,
                  profile: {
                    select: {
                      displayName: true,
                      pfpUrl: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  postComment: true,
                  postLike: true,
                },
              },
              postLike: {
                where: {
                  userId: loggedInUserId,
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const flattenPosts = postsObject.flatMap((friend) => friend.userB.post);

  return flattenPosts.map((post) => ({
    ...post,
    hasLiked: post.postLike.length > 0,
  }));
};

const getAllUsersPosts = async (id) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        datePosted: "desc",
      },
      where: {
        userId: id,
      },
      select: {
        id: true,
        content: true,
        datePosted: true,
        _count: {
          select: {
            postComment: true,
            postLike: true,
          },
        },
        user: {
          select: {
            profile: {
              select: {
                displayName: true,
                pfpUrl: true,
              },
            },
            username: true,
          },
        },
        postLike: {
          where: {
            userId: id,
          },
          select: {
            id: true,
          },
        },
      },
    });
    return posts.map((post) => ({
      ...post,
      hasLiked: post.postLike.length > 0,
    }));
  } catch (err) {
    console.log(err);
  }
};

const createPost = async (userId, content) => {
  try {
    const createdPost = await prisma.post.create({
      data: {
        userId: userId,
        content: content,
      },
    });
    return createdPost;
  } catch (error) {
    console.log(error);
  }
};

const getPostDetailsById = async (postId, loggedInUserId) => {
  try {
    let post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        likesNum: true,
        content: true,
        datePosted: true,
        likesNum: true,
        _count: {
          select: {
            postComment: true,
            postLike: true,
          },
        },
        postLike: {
          where: {
            userId: loggedInUserId,
          },
          select: {
            id: true,
          },
        },
        user: {
          select: {
            username: true,
            profile: {
              select: {
                displayName: true,
                pfpUrl: true,
              },
            },
          },
        },
      },
    });
    if (post) {
      post.hasLiked = post.postLike.length > 0;

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
    // Increment counter for post
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likesNum: {
          increment: 1,
        },
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
    // decrement counter from post counter
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likesNum: {
          decrement: 1,
        },
      },
    });
    return postLikeRemoved;
  } catch (error) {
    console.log(error);
  }
};

const getCommentsFromPostId = async (postId) => {
  try {
    const comments = await prisma.postComment.findMany({
      where: {
        postId: postId,
      },
      select: {
        content: true,
        id: true,
        datePosted: true,
        user: {
          select: {
            profile: {
              select: {
                displayName: true,
                pfpUrl: true,
              },
            },
          },
        },
      },
    });
    return comments;
  } catch (err) {
    return err;
  }
};

const addCommentToPost = async (postId, userId, content) => {
  try {
    return await prisma.postComment.create({
      data: {
        postId,
        userId,
        content,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const addFriendsById = async (userIdA, userIdB) => {
  try {
    const response = await prisma.userFriend.create({
      data: {
        userIdA,
        userIdB,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

const getUserDetailsByUsername = async (username) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getFriendshipRelationship = async (userIdA, userIdB) => {
  try {
    const query = await prisma.userFriend.findFirst({
      where: {
        AND: [
          {
            userIdA: {
              equals: userIdA,
            },
          },
          {
            userIdB: {
              equals: userIdB,
            },
          },
        ],
      },
    });
    return query;
  } catch (error) {
    console.log(error);
  }
};

const doesUserIdFollowUserId = async (userIdA, userIdB) => {
  try {
    const doesAfollowB = await getFriendshipRelationship(userIdA, userIdB);

    return doesAfollowB ? true : false;
  } catch (err) {
    console.log("Error running db query: ", err);
  }
};

const removeFriendsById = async (userFriendId) => {
  try {
    const query = await prisma.userFriend.delete({
      where: {
        id: userFriendId,
      },
    });
    return query;
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
  getCommentsFromPostId,
  addCommentToPost,
  addFriendsById,
  getUserDetailsByUsername,
  doesUserIdFollowUserId,
  removeFriendsById,
  getFriendshipRelationship,
  getAllPosts,
};
