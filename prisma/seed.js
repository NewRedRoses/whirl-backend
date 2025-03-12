#! /usr/bin/env node

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { faker } = require("@faker-js/faker");

const numberOfUsersToCreate = 10;

async function seed() {
  try {
    for (let x = 0; x < numberOfUsersToCreate; x++) {
      faker.seed(x);
      const newUser = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          username: faker.internet.username(),
        },
      });
      // // Create matching profile for the user
      const newProfile = await prisma.profile.create({
        data: {
          userId: newUser.id,
          displayName: newUser.name,
          bio: faker.person.bio(),
          pfpUrl: faker.image.urlPicsumPhotos(),
        },
      });
    }
  } catch (error) {
    console.log(`Error creating users: ${error}`);
  }
}
seed();
