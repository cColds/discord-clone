import "dotenv/config";
import User from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const generateRandomNums = () => {
  const numAmount = Math.floor(Math.random() * 5);
  const randomNumbers = new Array(numAmount)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10));

  return randomNumbers.join("");
};

const toLowerCase = (string: string) => string.toLowerCase();

const getRandUser = async () => {
  const displayName = faker.person.fullName().substring(0, 32);
  const statuses = ["Online", "Idle", "Do Not Disturb", "Invisible", "Offline"];

  const [firstName, lastName] = displayName.split(" ").map(toLowerCase);
  const username =
    displayName.split(" ")[0].toLowerCase() + generateRandomNums();
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const email = faker.internet.email({ firstName, lastName });
  const avatar = faker.image.avatarGitHub();

  const hashedPassword = await bcrypt.hash("password", 8);

  return {
    displayName,
    username,
    email,
    avatar,
    status,
    password: hashedPassword,
  };
};

const createPendingRequest = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = new User({
        ...(await getRandUser()),
        social: {
          pending: [{ user: id, request: "Outgoing" }],
        },
      });

      await user.save({ session });

      console.log("pending user created", user);

      await User.findByIdAndUpdate(
        id,
        {
          $push: {
            "social.pending": { user: user.id, request: "Incoming" },
          },
        },
        { session }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

const createBlockedUser = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const blockedUser = new User({
        ...(await getRandUser()),
      });

      await blockedUser.save({ session });

      console.log("blocked user created", blockedUser);

      await User.findByIdAndUpdate(
        id,
        { $push: { "social.blocked": blockedUser.id } },
        { session }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

const createFriend = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const friend = new User({
        ...(await getRandUser()),
        social: { friends: id },
      });

      await friend.save({ session });

      console.log("friend created", friend);

      await User.findByIdAndUpdate(
        id,
        { $push: { "social.friends": friend.id } },
        { session }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

export async function seed() {
  const id = process.argv[2];

  if (!id) throw new Error("id is not defined");

  await mongoose.connect(process.env.MONGODB_URI as string, {
    bufferCommands: false,
  });

  // create at least 3 users (one for pending, friend and blocked)

  const start = Date.now();

  await createPendingRequest(id);
  await createBlockedUser(id);
  await createFriend(id);

  const now = Date.now() - start;

  console.log(`${now / 1000}s elapsed`);

  await mongoose.disconnect();
}

seed();
