#! /usr/bin/env node

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { faker } = require("@faker-js/faker");
const { generateUsername } = require("unique-username-generator");

const numberOfUsersToCreate = process.env.fakeUsersNum || 3;

async function createGuestUser() {
  try {
    const guest = await prisma.user.findFirst({
      where: {
        username: "guest",
      },
    });
    if (!guest) {
      console.log("Creating user: 'guest'");
      const newGuest = await prisma.user.create({
        data: {
          name: "Guest User",
          role: "guest",
          username: "guest",
        },
      });

      console.log("Creating profile for 'guest' user");
      const newProfile = await prisma.profile.create({
        data: {
          userId: newGuest.id,
          displayName: newGuest.name,
          bio: "I exist only to show you around...",
          pfpUrl: faker.image.urlPicsumPhotos(),
        },
      });
      return;
    }
    return console.log("Guest user already created, skipping...");
  } catch (err) {
    console.log("Error creating guest user: ", err);
  }
}
async function seed() {
  try {
    createGuestUser();

    console.log(`Creating ${numberOfUsersToCreate} users...`);
    for (let x = 0; x < numberOfUsersToCreate; x++) {
      const newUser = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          username: generateUsername(),
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
    console.log("Successfully created all dummy users!");
  } catch (error) {
    console.log(`Error creating users: ${error}`);
  }
}
seed();
