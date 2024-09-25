"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";
import mongoose from "mongoose";

export async function deleteMessage(userId: string, messageId: string) {
  await dbConnect();

  const targetMessage = await Message.findById(messageId);
  if (!targetMessage) return;

  const canDeleteMessage = targetMessage.sender._id.toString() === userId;
  if (!canDeleteMessage) return;

  const messageIdToObjectId = new mongoose.Types.ObjectId(messageId);
  await Message.deleteOne({ _id: messageIdToObjectId });
}
