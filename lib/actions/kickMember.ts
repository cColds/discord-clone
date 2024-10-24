"use server";

import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";
import User from "@/models/User";

type kickMemberType = {
  serverId: string;
  senderId: string;
  recipientId: string;
};

export const kickMember = async ({
  serverId,
  senderId,
  recipientId,
}: kickMemberType) => {
  await dbConnect();

  const server = await Server.findById(serverId);

  const isOwner = server?.owner.toString() === senderId;
  if (!server || !isOwner) return;

  await Promise.all([
    await Server.findByIdAndUpdate(serverId, {
      $pull: { members: recipientId },
    }),
    await User.findByIdAndUpdate(recipientId, {
      $pull: { servers: server.id },
    }),
  ]);

  const serializedServer = JSON.parse(JSON.stringify(server));

  return serializedServer as typeof server;
};
