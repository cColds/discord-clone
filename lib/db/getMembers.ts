"use server";

import Server from "@/models/Server";
import dbConnect from "./dbConnect";
import { MemberTableType } from "@/types/server";

export const getMembers = async (serverId: string) => {
  await dbConnect();

  const server = await Server.findById(serverId)
    .select("members owner")
    .populate({
      path: "members",
      select: "username status id displayName online createdAt avatar",
    });

  if (!server) return null;

  const serializedMembers = JSON.parse(
    JSON.stringify({ owner: server.owner, members: server.members })
  );

  return serializedMembers as MemberTableType;
};
