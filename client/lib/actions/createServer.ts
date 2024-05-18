"use server";

import { createServerSchema } from "@/lib/validations/createServer";
import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";
import { uploadFileToCloudinary } from "@/lib/db/uploadFileToCloudinary";
import mongoose from "mongoose";
import User from "@/models/User";

export async function createServer(formData: FormData, userId: string) {
  const data = {
    serverName: formData.get("serverName"),
    icon: formData.get("file") || undefined,
  };

  const validatedFields = createServerSchema.safeParse(data);
  console.log("success: ", validatedFields.success);

  if (!validatedFields.success) return;

  await dbConnect();

  const { serverName, icon } = validatedFields.data;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      let iconUrl = "";
      if (icon) {
        iconUrl = await uploadFileToCloudinary(formData);
      }

      const server = new Server({
        serverName,
        icon: iconUrl || undefined,
        members: [userId],
        categories: [
          {
            categoryName: "Text Channels",
            channels: {
              type: "text",
              name: "general",
              messages: [],
            },
          },

          {
            categoryName: "Voice Channels",
            channels: {
              type: "text",
              name: "General",
              messages: [],
            },
          },
        ],
      });
      await server.save({ session });

      await User.findByIdAndUpdate(
        userId,
        { $push: { servers: server.id } },
        { session }
      );
    });
  } catch (err) {
    console.error(err);
    throw new Error("Server creation failed due to database error");
  }
}
