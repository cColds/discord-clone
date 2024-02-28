import { getUser } from "@/lib/db/getUser";
import ServerItems from "./ServerItems";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

export default async function ServerNav() {
  const { user } = (await getServerSession(authConfig)) || {};
  const userDoc = user ? await getUser(user.id) : null;

  if (userDoc == null) return null;

  return <ServerItems user={userDoc} />;
}
