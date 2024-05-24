"use server";

import { ServerType } from "@/types/server";
import dbConnect from "./dbConnect";
import Server from "@/models/Server";

export const getServer = async (serverId: string) => {
  await dbConnect();

  try {
    const server = await Server.findById(serverId);

    return (JSON.parse(JSON.stringify(server)) as ServerType) || null;
  } catch (error) {
    console.error("Failed to fetch server:", error);
    return null;
  }
};
