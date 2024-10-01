"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";
import { MessageType } from "@/types/message";
import { revalidatePath } from "next/cache";

export async function getMessages(channelId: string, pages = 0) {
  await dbConnect();

  const messages = await Message.find(
    { channelId },
    "sender message channelId _id createdAt updatedAt edited images readBy type"
  )
    .limit(50)
    .populate({ path: "sender", select: "-password -social -dms -servers -id" })
    .sort({ createdAt: -1 })
    .skip(pages * 50);

  const serializedMessages = JSON.parse(
    JSON.stringify(messages)
  ) as MessageType[];

  revalidatePath(`/channels/dms/${channelId}`);

  return serializedMessages.toReversed();
}
