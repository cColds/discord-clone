"use server";

import dbConnect from "../db/dbConnect";
import Message from "@/models/Message";
import Dm from "@/models/Dm";

export async function sendMessage(
  sender: string,
  message: string,
  channelId: string
) {
  await dbConnect();

  try {
    const messageDoc = new Message({ sender, message, channelId });
    await messageDoc.save();
  } catch (err) {
    console.error(err);
  }
}
