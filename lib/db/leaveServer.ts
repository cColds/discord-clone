"use server";

import Server from "@/models/Server";
import dbConnect from "./dbConnect";
import User from "@/models/User";
import { Types } from "mongoose";

export const leaveServer = async (userId: string, serverId: string) => {
  await dbConnect();

  const server = await Server.findById(serverId);
  const userObjectId = new Types.ObjectId(userId);

  if ((server?.members.length || 0) > 1 && userObjectId.equals(server?.owner)) {
    console.error(
      "Can't leave server if you are owner and there's another person in the server"
    );
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

  if (updatedServer?.members.length === 0) {
    await updatedServer.deleteOne();
  }

  return JSON.parse(JSON.stringify(updatedServer)) as typeof updatedServer;
};
