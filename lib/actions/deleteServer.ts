"use server";

import { z } from "zod";
import dbConnect from "@/lib/db/dbConnect";
import { deleteServerSchema } from "@/lib/validations/deleteServerSchema";
import Server from "@/models/Server";
import Message from "@/models/Message";
import User from "@/models/User";

type deleteServerType = {
  formData: z.infer<typeof deleteServerSchema>;
  userId: string;
  serverId: string;
};

export const deleteServer = async ({
  formData,
  userId,
  serverId,
}: deleteServerType) => {
  await dbConnect();

  const server = await Server.findById(serverId);

  if (
    !server ||
    !(server.owner.toString() === userId) ||
    formData.serverName !== server.serverName
  )
    throw new Error("Failed to delete server");
  const channelIds: string[] = [];

  server.channels.forEach((channel) => {
    channelIds.push(channel._id.toString());
  });

  server.categories.forEach((category) => {
    category.channels.forEach((channel) => {
      channelIds.push(channel._id.toString());
    });
  });

  await Promise.all([
    server.deleteOne(),
    await Message.find({ channelId: { $in: channelIds } }),
    User.updateMany({ $pull: { servers: serverId } }),
  ]);
};
