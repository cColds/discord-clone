"use server";

import dbConnect from "../db/dbConnect";
import Message from "@/models/Message";
import Dm from "@/models/Dm";
import { uploadToCloudinary } from "@/app/api/sign-cloudinary-params/route";
import { sendMessageSchema } from "../validations/sendMessage";
// Import necessary Node.js modules
import { Readable } from "stream";

/**
 * Convert a Node.js Readable stream (which `req` is) to a Buffer.
 */
function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export async function sendMessage(
  sender: string,
  formData: FormData,
  channelId: string
) {
  const data = {
    message: formData.get("message"),
    images: formData.get("file") || undefined,
  };

  await dbConnect();

  const message = data.message;

  console.log("message data: ", message);

  try {
    const imageUrls = [];

    const files = formData.getAll("file[]");
    if (files.length > 0) {
      console.log("Uploading images...");
      for (let file of files) {
        if (file instanceof File) {
          const buffer = await file.arrayBuffer(); // Convert file to arrayBuffer
          const base64Img = Buffer.from(buffer).toString("base64"); // Convert Buffer to Base64
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
      message,
      channelId,
      images: imageUrls,
    });
    await messageDoc.save();
  } catch (err) {
    console.error(err);
  }
}
