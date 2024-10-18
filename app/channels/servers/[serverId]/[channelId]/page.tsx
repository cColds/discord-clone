import { authConfig } from "@/auth.config";
import ServerChannelClient from "@/components/server/client-pages/ServerChannelClient";
import { getMessages } from "@/lib/db/getMessages";
import { getServer } from "@/lib/db/getServer";
import { getUser } from "@/lib/db/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ServerChannelPage({
  params,
}: {
  params: { serverId: string; channelId: string };
}) {
  const server = await getServer(params.serverId);
  const session = await getServerSession(authConfig);

  const user = await getUser(session?.user.id);

  const isMember = !!server?.members.find((m) => m.id === user?.id);

  if (!server || !isMember) redirect("/");

  const initialMessages = await getMessages(params.channelId);

  return (
    <ServerChannelClient
      server={server}
      channelId={params.channelId}
      initialMessages={initialMessages}
    />
  );
}
