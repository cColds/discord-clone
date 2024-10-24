"use server";

import dbConnect from "@/lib/db/dbConnect";
import Message from "@/models/Message";
import Server from "@/models/Server";
import { ServerType } from "@/types/server";

type deleteChannelProps = {
  userId: string;
  serverId: string;
  channelId: string;
};

export const deleteChannel = async ({
  userId,
  serverId,
  channelId,
}: deleteChannelProps) => {
  await dbConnect();

  const server = await Server.findById(serverId);

  if (!server) throw new Error("server not found");

  if (server.owner.toString() !== userId) return;

  const category = server.categories.find((cat) =>
    cat.channels.some((channel) => channel._id.toString() === channelId)
  );

  if (!category) {
    console.log("Category containing the channel was not found.");
    return;
  }

  await Message.deleteMany({ channelId });
  const updatedServer = await Server.findOneAndUpdate(
    { _id: serverId, "categories._id": category._id },
    { $pull: { "categories.$.channels": { _id: channelId } } },
    { new: true }
  );

  const serializedServer = JSON.parse(JSON.stringify(updatedServer));

  return serializedServer as ServerType;
};
