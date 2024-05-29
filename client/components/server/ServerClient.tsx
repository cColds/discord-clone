"use client";

import { ServerType } from "@/types/server";
import ServerSidebar from "./ServerSidebar";
import { redirect } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import NoTextChannels from "./NoTextChannels";
import Channel from "./Channel";

type ServerClientProps = {
  server: ServerType;
  channelId?: string;
};

const ServerClient = ({ server, channelId }: ServerClientProps) => {
  const { user } = useUser();
  if (!user) redirect("/");

  return (
    <div className="flex grow overflow-hidden h-full">
      <ServerSidebar server={server} user={user} />

      {channelId ? <Channel channelId={channelId} /> : <NoTextChannels />}
    </div>
  );
};

export default ServerClient;
