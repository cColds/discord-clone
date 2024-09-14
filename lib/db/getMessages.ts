"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";
import { MessageType } from "@/types/message";
import { revalidatePath } from "next/cache";

export async function getMessages(channelId: string) {
  await dbConnect();

  const messages = await Message.find(
    { channelId },
    "sender message channelId _id createdAt updatedAt edited images readBy"
  )
    .limit(50)
    .populate({ path: "sender", select: "-password -social -dms -servers -id" })
    .sort({ createdAt: -1 });

  const serializedMessages = JSON.parse(
    JSON.stringify(messages)
  ) as MessageType[];

  revalidatePath(`/channels/dms/${channelId}`);

  return serializedMessages.toReversed();
}
