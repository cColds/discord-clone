"use client";

import { ServerType } from "@/types/server";
import ServerSidebar from "../ServerSidebar";
import { redirect } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import NoTextChannels from "../NoTextChannels";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ServerClientProps = {
  server: ServerType;
};

const ServerClient = ({ server }: ServerClientProps) => {
  const { user } = useUser();
  if (!user) redirect("/");

  const router = useRouter();

  useEffect(() => {
    if (server.categories && server.categories.length > 0) {
      const firstCategory = server.categories[0];
      if (firstCategory.channels && firstCategory.channels.length > 0) {
        const firstChannelId = firstCategory.channels[0]._id;
        router.push(`/channels/servers/${server._id}/${firstChannelId}`);
      }
    }
  }, [server, router]);

  return (
    <div className="flex grow overflow-hidden h-full">
      <ServerSidebar server={server} user={user} />

      <NoTextChannels />
    </div>
  );
};

export default ServerClient;
