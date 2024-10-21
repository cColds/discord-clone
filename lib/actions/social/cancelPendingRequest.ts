"use server";

import mongoose from "mongoose";
import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";

export const cancelPendingRequest = async (
  senderId: string,
  recipientId: string
) => {
  await dbConnect();
  const mongooseSession = await mongoose.startSession();

  try {
    await mongooseSession.withTransaction(async () => {
      await Promise.all([
        User.findByIdAndUpdate(
          recipientId,
          { $pull: { "social.pending": { user: senderId } } },
          { session: mongooseSession }
        ),
        User.findByIdAndUpdate(
          senderId,
          { $pull: { "social.pending": { user: recipientId } } },
          { session: mongooseSession }
        ),
      ]);
    });
  } catch (err) {
    console.error(err);
  }
};
