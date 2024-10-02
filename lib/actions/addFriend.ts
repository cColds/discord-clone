"use server";
import { z } from "zod";
import User, { UserDM } from "@/models/User";
import Dm from "@/models/Dm";
import dbConnect from "../db/dbConnect";
import { addFriendSchema } from "../validations/addFriend";
import mongoose from "mongoose";

const isIdInArray = (ids: mongoose.Types.ObjectId[], idToFind: string) => {
  return ids.find((id) => idToFind === id.toString());
};

export async function addFriend(
  formData: z.infer<typeof addFriendSchema>,
  yourUserId: string
) {
  try {
    const validatedFields = addFriendSchema.safeParse(formData);
    if (!validatedFields.success || yourUserId === "") return;

    const { friendUsername } = validatedFields.data;
    await dbConnect();

    const yourAccount = await User.findById(yourUserId);

    // Handle cases where you can't add a friend.

    if (!yourAccount) throw new Error("Your account doesn't exist");

    const friendAccount = await User.findOne({
      username: { $regex: `^${friendUsername}$`, $options: "i" },
    });

    if (!friendAccount)
      throw new Error(
        "Hm, didn't work. Double check that the username is correct."
      );

    if (yourAccount.id === friendAccount.id)
      throw new Error("You can't friend yourself");

    const { friends, pending, blocked } = yourAccount.social;

    const isAlreadyFriends = isIdInArray(friends, friendAccount.id);
    if (isAlreadyFriends)
      throw new Error("You're already friends with that user!");

    const isYourAccountBlocked = isIdInArray(
      friendAccount.social.blocked,
      yourAccount.id
    );

    if (isYourAccountBlocked)
      throw new Error("You can't friend people that blocked you");

    const haveYouSentRequest = isIdInArray(
      pending.map((p) => p.user),
      friendAccount.id
    );

    if (haveYouSentRequest)
      throw new Error("You've already sent a friend request to that user");
    // todo: dont throw error if other person sent just accept

    // Start transaction to accept friend request or send one (need to update your account and friend account's socials)

    // Accept friend request if they've sent one already (incoming pending)
    // If you've blocked them, remove the blocked request and then send them one
    // Otherwise, send the friend request (outgoing pending)

    // Accepts friend request if friend sent a request

    const hasIncomingRequest = isIdInArray(
      pending.map((p) => p.user),
      friendAccount.id
    );

    if (hasIncomingRequest) {
      console.log("Accepting friend request");
      // Create DM if one doesn't exist yet

      const dmExists = yourAccount.dms.find(
        (dm) => dm.recipient.toString() === friendAccount.id
      );

      console.log("Dm exists:", dmExists);

      if (!dmExists) {
        const dm = new Dm({
          members: [yourAccount._id, friendAccount._id],
          lastMessageTimestamp: new Date(),
        });

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

        await dm.save();

        await User.findByIdAndUpdate(yourUserId, {
          $push: { dms: yourDMOpts },
        });

        await User.findByIdAndUpdate(friendAccount.id, {
          $push: {
            dms: recipientDMOpts,
          },
        }),
          console.log("Created dm");
      }

      await Promise.all([
        User.findByIdAndUpdate(yourUserId, {
          $pull: { "social.pending": { user: friendAccount.id } },
          $push: { "social.friends": friendAccount.id },
        }),
        User.findByIdAndUpdate(friendAccount.id, {
          $pull: { "social.pending": { user: yourAccount.id } },
          $push: { "social.friends": yourAccount.id },
        }),
      ]);

      return { success: true };
    }

    // Unblocks friend and then send request

    const isFriendBlocked = isIdInArray(blocked, friendAccount.id);

    if (isFriendBlocked) {
      console.log("Unblock friend and then send request");

      await Promise.all([
        User.findByIdAndUpdate(yourUserId, {
          $pull: {
            "social.blocked": friendAccount.id,
          },
          $push: {
            "social.pending": {
              user: friendAccount.id,
              request: "Outgoing",
            },
          },
        }),
        User.findByIdAndUpdate(friendAccount.id, {
          $push: {
            "social.pending": {
              user: yourAccount.id,
              request: "Incoming",
            },
          },
        }),
      ]);
      return { success: true };
    }

    // Send an outgoing friend request

    console.log("Sending an outgoing friend request");

    await Promise.all([
      User.findByIdAndUpdate(yourUserId, {
        $push: {
          "social.pending": {
            user: friendAccount.id,
            request: "Outgoing",
          },
        },
      }),
      User.findByIdAndUpdate(friendAccount.id, {
        $push: {
          "social.pending": { user: yourAccount.id, request: "Incoming" },
        },
      }),
    ]);

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
