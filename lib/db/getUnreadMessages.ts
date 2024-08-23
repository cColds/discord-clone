"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";
import mongoose from "mongoose";

export async function getUnreadMessages(userId: string) {
  await dbConnect();

  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  const unreadMessages = await Message.aggregate([
    { $match: { readBy: { $ne: objectIdUserId } } },
    {
      $group: {
        _id: "$channelId",
        unreadCount: { $sum: 1 },
      },
    },
    {
      $project: {
        channelId: "$_id",
        unreadCount: 1,
        _id: 0,
      },
    },
  ]);

  return unreadMessages;
}
