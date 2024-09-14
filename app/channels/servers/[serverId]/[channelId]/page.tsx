import ServerChannelClient from "@/components/server/client-pages/ServerChannelClient";
import { getMessages } from "@/lib/db/getMessages";
import { getServer } from "@/lib/db/getServer";
import { redirect } from "next/navigation";

export default async function ServerChannelPage({
  params,
}: {
  params: { serverId: string; channelId: string };
}) {
  const server = await getServer(params.serverId);
  if (!server) redirect("/");

  const initialMessages = await getMessages(params.channelId);

  return (
    <ServerChannelClient
      server={server}
      channelId={params.channelId}
      initialMessages={initialMessages}
    />
  );
}
