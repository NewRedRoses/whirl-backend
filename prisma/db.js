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

module.exports = { getUserProfileByUserId };
