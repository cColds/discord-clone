"use server";

import { z } from "zod";
import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";
import { addFriendSchema } from "@/lib/validations/addFriend";
import { isIdInArray } from "@/utils/helpers/isIdInArray";
import {
  handleIncomingRequest,
  sendFriendRequest,
  unblockAndSendRequest,
} from "@/lib/dbHelpers";

export async function addFriend(
  formData: z.infer<typeof addFriendSchema>,
  senderId: string
) {
  try {
    const validatedFields = addFriendSchema.safeParse(formData);
    if (!validatedFields.success || senderId === "") return;

    const { recipientUsername } = validatedFields.data;
    await dbConnect();

    const sender = await User.findById(senderId);

    if (!sender) throw new Error("Your account doesn't exist");
    const recipient = await User.findOne({
      username: { $regex: `^${recipientUsername}$`, $options: "i" },
    });

    if (!recipient)
      throw new Error(
        "Hm, didn't work. Double check that the username is correct."
      );

    if (sender.id === recipient.id)
      throw new Error("You can't friend yourself");

    const { friends, pending, blocked } = sender.social;

    const isFriends = isIdInArray(friends, recipient.id);
    if (isFriends) throw new Error("You're already friends with that user!");

    const isSenderBlocked = isIdInArray(recipient.social.blocked, sender.id);
    if (isSenderBlocked)
      throw new Error("You can't friend people that blocked you");

    const senderSentRequest = isIdInArray(
      pending.map((p) => p.user),
      recipient.id
    );
    if (senderSentRequest)
      throw new Error("You've already sent a friend request to that user");
    // todo: dont throw error if other person sent just accept

    const hasIncomingRequest = isIdInArray(
      pending.map((p) => p.user),
      recipient.id
    );

    if (hasIncomingRequest) {
      const dmExists = sender.dms.find(
        (dm) => dm.recipient.toString() === recipient.id
      );

      if (!dmExists) {
        await handleIncomingRequest(sender.id, recipient.id);
      }

      return { success: true };
    }

    const isRecipientBlocked = isIdInArray(blocked, recipient.id);

    if (isRecipientBlocked) {
      await unblockAndSendRequest(sender.id, recipient.id);
      return { success: true };
    }

    await sendFriendRequest(sender.id, recipient.id);

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
