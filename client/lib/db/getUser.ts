"use server";

import User from "@/models/User";
import { UserType } from "@/types/user";
import dbConnect from "./dbConnect";

export async function getUser(id?: string) {
  if (!id) return null;

  await dbConnect();
  const user = await User.findById(id).populate({
    path: "social.friends social.pending.user social.blocked dms.channelId dms.recipientId",
    select: "-password",
  });

  const serializedUser = JSON.parse(JSON.stringify(user)) as UserType;

  return serializedUser;
}
