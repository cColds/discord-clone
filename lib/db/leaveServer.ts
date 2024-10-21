"use server";

import Server from "@/models/Server";
import dbConnect from "./dbConnect";
import User from "@/models/User";
import { Types } from "mongoose";

export const leaveServer = async (userId: string, serverId: string) => {
  await dbConnect();

  const server = await Server.findById(serverId);
  const userObjectId = new Types.ObjectId(userId);

  if (userObjectId.equals(server?.owner)) {
    console.error("Owners can't leave the server. Delete it instead.");
    return;
  }

  const updatedServer = await Server.findByIdAndUpdate(
    serverId,
    {
      $pull: { members: userId },
    },
    { new: true }
  );

  await User.findByIdAndUpdate(userId, {
    $pull: { servers: serverId },
  });

  return JSON.parse(JSON.stringify(updatedServer)) as typeof updatedServer;
};
