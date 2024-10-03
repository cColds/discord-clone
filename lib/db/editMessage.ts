"use server";

import Message from "@/models/Message";
import dbConnect from "./dbConnect";

export async function editMessage(messageId: string, updatedMessage: string) {
  try {
    await dbConnect();
    const msg = await Message.findByIdAndUpdate(
      messageId,
      {
        $set: { message: updatedMessage, edited: new Date() },
      },
      { new: true }
    );
  } catch (err) {
    throw new Error(err);
  }
}
