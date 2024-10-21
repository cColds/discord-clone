"use server";

import mongoose from "mongoose";
import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";

export const unfriendUser = async (senderId: string, recipientId: string) => {
  if (!senderId) return;

  await dbConnect();
  const mongooseSession = await mongoose.startSession();

  try {
    await mongooseSession.withTransaction(async () => {
      return await Promise.all([
        User.findByIdAndUpdate(
          recipientId,
          {
            $pull: { "social.friends": senderId },
          },
          { session: mongooseSession }
        ),
        User.findByIdAndUpdate(
          senderId,
          {
            $pull: {
              "social.friends": recipientId,
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
