"use server";

import mongoose from "mongoose";
import User from "@/models/User";
import dbConnect from "../../dbConnect";

export const cancelPendingRequest = async (
  userId: string,
  friendId: string
) => {
  await dbConnect();
  const mongooseSession = await mongoose.startSession();

  try {
    await mongooseSession.withTransaction(async () => {
      await Promise.all([
        User.findByIdAndUpdate(
          friendId,
          { $pull: { "social.pending": { user: userId } } },
          { session: mongooseSession }
        ),
        User.findByIdAndUpdate(
          userId,
          { $pull: { "social.pending": { user: friendId } } },
          { session: mongooseSession }
        ),
      ]);
    });

    console.log("Cancel request success!");
  } catch (err) {
    console.error(err);
  }
};
