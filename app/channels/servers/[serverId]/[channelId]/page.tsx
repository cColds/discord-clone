import ServerChannelClient from "@/components/server/client-pages/ServerChannelClient";
import { getServer } from "@/lib/db/getServer";
import { redirect } from "next/navigation";

export default async function ServerChannelPage({
  params,
}: {
  params: { serverId: string; channelId: string };
}) {
  const server = await getServer(params.serverId);
  if (!server) redirect("/");

  return <ServerChannelClient server={server} channelId={params.channelId} />;
}
