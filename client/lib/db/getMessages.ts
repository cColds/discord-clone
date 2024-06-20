"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";
import { MessageType } from "@/types/message";

export async function getMessages(messagesAmount: number, channelId: string) {
  await dbConnect();
  const messages = await Message.find(
    { channelId },
    { sort: { createdAt: -1 }, limit: messagesAmount }
  ).populate({
    path: "sender message channelId _id createdAt updatedAt edited images", // idk why have to put path here to project all fields
    select: "-password",
  });
  const serializedMessages = JSON.parse(
    JSON.stringify(messages)
  ) as MessageType[];

  return serializedMessages;
}
