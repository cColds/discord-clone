import User from "@/models/User";
import dbConnect from "./dbConnect";
import { SocialPopulated } from "@/types/social";

export async function getUser(id?: string) {
  if (!id) return null;

  await dbConnect();
  const user = await User.findById(id).populate<
    Pick<SocialPopulated, "social">
  >({
    path: "social.friends social.pending social.blocked",
    select: "username displayName avatar status social",
  });

  const serializedUser = JSON.parse(JSON.stringify(user)) as typeof user;

  return serializedUser;
}
