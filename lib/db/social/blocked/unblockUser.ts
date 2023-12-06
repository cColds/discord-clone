"use server";

import User from "@/models/User";
import dbConnect from "../../dbConnect";

export const unblockUser = async (userId: string, friendId: string) => {
  if (!userId) return;

  await dbConnect();

  try {
    const newDoc = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { "social.blocked": friendId },
      },
      { new: true }
    );

    console.log("User unblocked!", newDoc);
  } catch (err) {
    console.error(err);
  }
};
