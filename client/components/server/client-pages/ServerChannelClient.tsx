"use client";

import { useUser } from "@/app/providers/UserProvider";
import { ServerType } from "@/types/server";
import ServerSidebar from "../ServerSidebar";
import Channel from "../Channel";
import NoTextChannels from "../NoTextChannels";
import { redirect } from "next/navigation";

type ServerChannelClientProps = {
  server: ServerType;
  channelId?: string;
};

const ServerChannelClient = ({
  server,
  channelId,
}: ServerChannelClientProps) => {
  const { user } = useUser();
  if (!user) redirect("/");

  let currentChannel =
    server.channels.find((channel) => channel._id === channelId) || null;

  if (currentChannel == null) {
    for (const category of server.categories) {
      const foundChannel = category.channels.find(
        (channel) => channel._id === channelId
      );
      if (foundChannel) {
        currentChannel = foundChannel;
        break;
      }
    }
  }

  return (
    <div className="flex grow overflow-hidden h-full">
      <ServerSidebar server={server} user={user} />

      {channelId && currentChannel ? (
        <Channel channelId={channelId} channel={currentChannel} />
      ) : (
        <NoTextChannels />
      )}
    </div>
  );
};

export default ServerChannelClient;
