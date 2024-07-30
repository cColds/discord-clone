"use server";

import User from "@/models/User";
import dbConnect from "./dbConnect";

export async function getUserId(username: string) {
  await dbConnect();
  const user = await User.findOne({
    username: { $regex: `^${username}$`, $options: "i" },
  });

  if (!user) return null;

  return user.id;
}
