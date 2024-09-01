"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";
import mongoose from "mongoose";

type UnreadMessageAggregation = {
  _id: string;
  unreadCount: number;
  firstUnreadMessage: string;
  channelId: string;
};

export async function getUnreadMessages(userId: string) {
  await dbConnect();

  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  const unreadMessages: UnreadMessageAggregation[] = await Message.aggregate([
    {
      $match: {
        readBy: { $ne: objectIdUserId },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$channelId",
        unreadCount: { $sum: 1 },
        firstUnreadMessage: { $first: "$createdAt" },
      },
    },
    {
      $project: {
        channelId: "$_id",
        unreadCount: 1,
        firstUnreadMessage: { $toString: "$firstUnreadMessage" },
      },
    },
  ]);

  const sortedUnreadMessages = unreadMessages.sort(
    (a, b) =>
      new Date(b.firstUnreadMessage).getTime() -
      new Date(a.firstUnreadMessage).getTime()
  );

  return sortedUnreadMessages;
}
