"use server";

import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";
import Dm from "@/models/Dm";
import { isIdInArray } from "@/utils/helpers/isIdInArray";

export const acceptPendingRequest = async (
  senderId: string,
  recipientId: string
) => {
  try {
    await dbConnect();

    const sender = await User.findById(senderId);

    if (!sender) throw new Error("Your account doesn't exist");

    const recipient = await User.findById(recipientId);

    if (!recipient) throw new Error("Friend account doesn't exist");

    const { friends } = sender.social;

    const isFriends = isIdInArray(friends, recipient.id);
    if (isFriends) throw new Error("You're already friends with that user!");

    const dmExists = sender.dms.find(
      (dm) => dm.recipient.toString() === recipientId
    );

    if (!dmExists) {
      const dm = new Dm({
        members: [sender._id, recipient._id],
        lastMessageTimestamp: new Date(),
      });

      await dm.save();

      await Promise.all([
        User.findByIdAndUpdate(senderId, {
          $push: {
            dms: { channel: dm._id, recipient: recipient._id, open: true },
          },
        }),
        User.findByIdAndUpdate(recipientId, {
          $push: {
            dms: { channel: dm._id, recipient: sender._id, open: true },
          },
        }),
      ]);
    }

    // Accept friend request
    await Promise.all([
      User.findByIdAndUpdate(recipientId, {
        $pull: { "social.pending": { user: senderId } },
        $push: { "social.friends": senderId },
      }),
      User.findByIdAndUpdate(senderId, {
        $pull: {
          "social.pending": { user: recipientId },
        },
        $push: { "social.friends": recipientId },
      }),
    ]);
  } catch (err) {
    console.error(err);
  }
};
