"use server";

import { z } from "zod";
import { editChannelSchema } from "@/lib/validations/editChannelSchema";
import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";

type editChannelProps = {
  formData: z.infer<typeof editChannelSchema>;
  serverId: string;
  channelId: string;
  userId: string;
};
export const editChannel = async ({
  formData,
  serverId,
  channelId,
  userId,
}: editChannelProps) => {
  const validatedFields = editChannelSchema.safeParse(formData);

  if (!validatedFields.success) return;

  await dbConnect();

  const server = await Server.findById(serverId);
  const isOwner = server?.owner.toString() === userId;

  if (!isOwner) return;

  const category = server.categories.find((cat) =>
    cat.channels.some((channel) => channel._id.toString() === channelId)
  );

  if (!category) {
    console.log("Category containing the channel was not found.");
    return;
  }

  await Server.updateOne(
    {
      _id: serverId,
      "categories._id": category._id,
      "categories.channels._id": channelId,
    },
    {
      $set: {
        "categories.$[category].channels.$[channel].name": formData.channelName,
      },
    },
    {
      arrayFilters: [
        { "category._id": category._id },
        { "channel._id": channelId },
      ],
    }
  );

  const serializedServer = JSON.parse(JSON.stringify(server));
  return serializedServer as typeof server;
};
