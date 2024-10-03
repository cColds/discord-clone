"use server";

import User, { UserDM } from "@/models/User";
import dbConnect from "../../dbConnect";
import Dm from "@/models/Dm";

export const acceptPendingRequest = async (
  userId: string,
  friendId: string
) => {
  try {
    await dbConnect();

    const yourAccount = await User.findById(userId);

    // Handle cases where you can't add a friend.

    if (!yourAccount) throw new Error("Your account doesn't exist");

    const friendAccount = await User.findById(friendId);

    if (!friendAccount) throw new Error("Friend account doesn't exist");

    const dmExists = yourAccount.dms.find(
      (dm) => dm.recipient.toString() === friendId
    );

    if (!dmExists) {
      // Create Dm
      const dm = new Dm({
        members: [yourAccount._id, friendAccount._id],
        lastMessageTimestamp: new Date(),
      });

      await dm.save();

      const yourDMOpts: UserDM = {
        channel: dm._id,
        recipient: friendAccount._id,
        open: true,
      };

      const recipientDMOpts: UserDM = {
        channel: dm._id,
        recipient: yourAccount._id,
        open: true,
      };

      await Promise.all([
        User.findByIdAndUpdate(userId, {
          $push: { dms: yourDMOpts },
        }),
        User.findByIdAndUpdate(friendId, {
          $push: {
            dms: recipientDMOpts,
          },
        }),
      ]);
    }

    // Accept friend request
    await Promise.all([
      User.findByIdAndUpdate(friendId, {
        $pull: { "social.pending": { user: userId } },
        $push: { "social.friends": userId },
      }),
      User.findByIdAndUpdate(userId, {
        $pull: {
          "social.pending": { user: friendId },
        },
        $push: { "social.friends": friendId },
      }),
    ]);
  } catch (err) {
    console.error(err);
  }
};
