import { authConfig } from "@/auth.config";
import ServerClient from "@/components/server/client-pages/ServerClient";
import { getServer } from "@/lib/db/getServer";
import { getUser } from "@/lib/db/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ServerPage({
  params,
}: {
  params: { serverId: string };
}) {
  const session = await getServerSession(authConfig);

  const user = await getUser(session?.user.id);
  const server = await getServer(params.serverId, user?.id || "");

  const isMember = !!server?.members.find((m) => m.id === user?.id);
  if (!server || !isMember) redirect("/");

  return <ServerClient server={server} />;
}
