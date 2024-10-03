"use server";

import mongoose from "mongoose";
import User from "@/models/User";
import dbConnect from "../../dbConnect";

export const unfriendUser = async (userId: string, friendId: string) => {
  if (!userId) return;

  await dbConnect();
  const mongooseSession = await mongoose.startSession();

  try {
    await mongooseSession.withTransaction(async () => {
      return await Promise.all([
        User.findByIdAndUpdate(
          friendId,
          {
            $pull: { "social.friends": userId },
          },
          { session: mongooseSession }
        ),
        User.findByIdAndUpdate(
          userId,
          {
            $pull: {
              "social.friends": friendId,
            },
          },
          { session: mongooseSession }
        ),
      ]);
    });
  } catch (err) {
    console.error(err);
  }
};
