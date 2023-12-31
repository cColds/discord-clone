"use server";

import mongoose from "mongoose";
import User from "@/models/User";
import dbConnect from "../../dbConnect";

export const acceptPendingRequest = async (
  userId: string,
  friendId: string
) => {
  if (!userId) return;

  await dbConnect();
  const mongooseSession = await mongoose.startSession();

  try {
    await mongooseSession.withTransaction(async () => {
      await Promise.all([
        User.findByIdAndUpdate(
          friendId,
          {
            $pull: { "social.pending": { user: userId } },
            $push: { "social.friends": userId },
          },
          { session: mongooseSession }
        ),
        User.findByIdAndUpdate(
          userId,
          {
            $pull: {
              "social.pending": { user: friendId },
            },
            $push: { "social.friends": friendId },
          },
          { session: mongooseSession }
        ),
      ]);
    });
    console.log("Accepted friend request!");
  } catch (err) {
    console.error(err);
  }
};
