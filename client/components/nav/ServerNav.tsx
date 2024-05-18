"use server";

import { getUser } from "@/lib/db/getUser";
import ServerItems from "./ServerItems";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { getServers } from "@/lib/db/getServers";

export default async function ServerNav() {
  const { user } = (await getServerSession(authConfig)) || {};
  const userDoc = user ? await getUser(user.id) : null;

  if (userDoc == null) return null;

  const servers = await getServers(userDoc.id);
  console.log(servers);
  return <ServerItems user={userDoc} servers={servers} />;
}
