"use server";

import { z } from "zod";
import { createChannelSchema } from "../validations/createChannel";
import dbConnect from "../db/dbConnect";
import Server from "@/models/Server";

export const createChannel = async (
  formData: z.infer<typeof createChannelSchema>,

  serverId: string,
  categoryId: string
) => {
  const validatedFields = createChannelSchema.safeParse(formData);
  if (!validatedFields.success) return;

  const { channelName, channelType } = validatedFields.data;

  await dbConnect();

  try {
    await Server.updateOne(
      { _id: serverId, "categories._id": categoryId },
      {
        $push: {
          "categories.$.channels": {
            type: channelType,
            name: channelName,
            messages: [],
          },
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
};
