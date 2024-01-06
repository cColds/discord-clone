"use server";

import User from "@/models/User";
import dbConnect from "./dbConnect";
import { SocialPopulated } from "@/types/social";
import { SessionUser } from "@/types/SessionUser";

export async function getUser(id?: string) {
  if (!id) return null;

  await dbConnect();
  const user = await User.findById(id).populate<
    Pick<SocialPopulated, "social">
  >({
    path: "social.friends social.pending.user social.blocked",
    select: "username displayName avatar status social",
  });

  const serializedUser = JSON.parse(JSON.stringify(user)) as SessionUser &
    SocialPopulated;

  return serializedUser;
}
