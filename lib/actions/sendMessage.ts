"use server";

import dbConnect from "../db/dbConnect";
import Message from "@/models/Message";
import Dm from "@/models/Dm";
import { uploadToCloudinary } from "../db/uploadToCloudinary";

export async function sendMessage(
  sender: string,
  formData: FormData,
  channelId: string,
  type: "dm" | "server"
) {
  const data = {
    message: formData.get("message"),
    images: formData.get("file") || undefined,
  };

  const { message } = data;
  const files = formData.getAll("file[]");

  const invalidMessage = !message?.toString().trim() && !files.length;

  if (invalidMessage) return;

  try {
    await dbConnect();
    const imageUrls = [];

    if (files.length > 0) {
      console.log("Uploading images...");
      for (let file of files) {
        if (file instanceof File) {
          const buffer = await file.arrayBuffer();
          const base64Img = Buffer.from(buffer).toString("base64");
          const res = await uploadToCloudinary(
            `data:${file.type};base64,${base64Img}`,
            file.name
          );
          console.log("Upload response:", res);

          if (res.success && res.result) {
            const { original_filename, secure_url, asset_id } = res.result;

            imageUrls.push({
              name: original_filename,
              url: secure_url,
              id: asset_id,
            });
          }
        }
      }
    }

    const messageDoc = new Message({
      sender,
      message: message?.toString().trim() || "",
      channelId,
      images: imageUrls,
    });
    await messageDoc.save();

    if (type === "dm") {
      await Dm.findByIdAndUpdate(
        channelId,
        { $set: { lastMessageTimestamp: new Date() } },
        { strict: false }
      );
    }
  } catch (err) {
    console.error(err);
  }
}
