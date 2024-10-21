"use server";

import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";

export const unblockUser = async (senderId: string, recipientId: string) => {
  if (!senderId) return;

  await dbConnect();

  try {
    await User.findByIdAndUpdate(senderId, {
      $pull: { "social.blocked": recipientId },
    });
  } catch (err) {
    console.error(err);
  }
};
