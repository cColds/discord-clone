"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";

export async function readMessages(userId: string, channelId: string) {
  await dbConnect();

  await Message.updateMany(
    { readBy: { $ne: userId }, channelId },
    { $push: { readBy: userId } }
  );
}
