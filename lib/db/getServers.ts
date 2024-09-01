"use server";

import User from "@/models/User";
import dbConnect from "./dbConnect";
import { ServerNavItem } from "@/types/server";

export const getServers = async (userId: string) => {
  await dbConnect();

  try {
    const userDoc = await User.findById<{ servers: ServerNavItem[] }>(
      userId
    ).populate({
      path: "servers",
      select: "_id serverName icon",
      options: { sort: { _id: -1 } },
    });

    return JSON.parse(JSON.stringify(userDoc?.servers)) || [];
  } catch (error) {
    console.error("Failed to fetch servers:", error);
    return [];
  }
};
