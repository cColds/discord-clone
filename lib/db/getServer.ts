"use server";

import { ServerType } from "@/types/server";
import dbConnect from "./dbConnect";
import Server from "@/models/Server";

export const getServer = async (serverId: string, userId: string) => {
  await dbConnect();

  try {
    const isInServer = await Server.findOne({
      _id: serverId,
      members: { $in: [userId] },
    });

    if (!isInServer) return null;

    const server = await Server.findById(serverId).populate({
      path: "members",
      select: "displayName avatar id status online username createdAt owner",
    });

    const serializedServer =
      (JSON.parse(JSON.stringify(server)) as ServerType) || null;

    return serializedServer;
  } catch (error) {
    console.error("Failed to fetch server:", error);
    return null;
  }
};
