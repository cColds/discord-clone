"use server";

import mongoose from "mongoose";
import User, { UserDM } from "@/models/User";
import dbConnect from "../../dbConnect";
import Dm from "@/models/Dm";

export const acceptPendingRequest = async (
  userId: string,
  friendId: string
) => {
  try {
    await dbConnect();
    const mongooseSession = await mongoose.startSession();

    const yourAccount = await User.findById(userId);

    // Handle cases where you can't add a friend.

    if (!yourAccount) throw new Error("Your account doesn't exist");

    const friendAccount = await User.findById(friendId);

    if (!friendAccount) throw new Error("Friend account doesn't exist");

    await mongooseSession.withTransaction(async () => {
      const dmExists = yourAccount.dms.find(
        (dm) => dm.recipientId.toString() === friendId
      );

      if (!dmExists) {
        const dm = new Dm({
          members: [yourAccount._id, friendAccount._id],
          messages: [],
        });

        const yourDMOpts: UserDM = {
          channelId: dm._id,
          recipientId: friendAccount._id,
          open: true,
        };

        const recipientDMOpts: UserDM = {
          channelId: dm._id,
          recipientId: yourAccount._id,
          open: true,
        };

        await Promise.all([
          dm.save(),
          User.findByIdAndUpdate(userId, {
            $push: { dms: yourDMOpts },
          }),
          User.findByIdAndUpdate(friendId, {
            $push: {
              dms: recipientDMOpts,
            },
          }),
        ]);
        console.log("Created dm");
      }

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
