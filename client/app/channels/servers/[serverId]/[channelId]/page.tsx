import ServerClient from "@/components/server/ServerClient";
import { getServer } from "@/lib/db/getServer";
import { redirect } from "next/navigation";

export default async function ServerChannelPage({
  params,
}: {
  params: { serverId: string; channelId: string };
}) {
  const server = await getServer(params.serverId);
  if (!server) redirect("/");

  return <ServerClient server={server} channelId={params.channelId} />;
}
