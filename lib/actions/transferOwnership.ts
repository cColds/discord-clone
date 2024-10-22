"use server";

import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";
import User from "@/models/User";

type transferOwnershipType = {
  serverId: string;
  senderId: string;
  recipientId: string;
};

export const transferOwnership = async ({
  serverId,
  senderId,
  recipientId,
}: transferOwnershipType) => {
  await dbConnect();

  const server = await Server.findById(serverId);

  const isOwner = server?.owner.toString() === senderId;
  if (!server || !isOwner) return;

  await Server.findByIdAndUpdate(serverId, { owner: recipientId });

  const serializedServer = JSON.parse(JSON.stringify(server));

  return serializedServer as typeof server;
};
