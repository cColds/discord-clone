"use client";

import { useUser } from "@/app/providers/UserProvider";
import { ServerType } from "@/types/server";
import ServerSidebar from "../ServerSidebar";
import Channel from "../Channel";
import NoTextChannels from "../NoTextChannels";
import { redirect } from "next/navigation";
import { MessageType } from "@/types/message";
import { useEffect, useState } from "react";
import { useSocket } from "@/app/providers/SocketProvider";
import { getUser } from "@/lib/db/getUser";
import { getMessages } from "@/lib/db/getMessages";
import { getServer } from "@/lib/db/getServer";

type ServerChannelClientProps = {
  server: ServerType;
  channelId?: string;
  initialMessages: MessageType[];
};

const ServerChannelClient = ({
  server,
  channelId,
  initialMessages,
}: ServerChannelClientProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [serverState, setServerState] = useState(server);

  const { user, setUser } = useUser();
  if (!user) redirect("/");

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-channel", channelId);

    socket.on("update-friend-list", async () => {
      const updatedUser = await getUser(user.id);

      if (updatedUser !== null) {
        setUser(updatedUser);
      }
    });

    socket.on("update-online-status", (isOnline: boolean) => {
      setUser({ ...user, online: isOnline });
    });

    socket.on("update-friends-online-status", async (isOnline: boolean) => {
      const updatedUser = await getUser(user.id);

      if (updatedUser) {
        setUser(updatedUser);
      } else {
        console.error("failed to update user");
      }
    });

    socket.on("received-message", async () => {
      if (channelId) {
        const updatedMessages = await getMessages(25, channelId);

        setMessages(updatedMessages);
      }
    });

    socket.on("create-channel", async () => {
      const updatedServer = await getServer(server._id);
      if (updatedServer) {
        setServerState(updatedServer);
      }
    });

    return () => socket.disconnect();
  }, [socket]);

  let currentChannel =
    serverState.channels.find((channel) => channel._id === channelId) || null;

  if (currentChannel == null) {
    for (const category of serverState.categories) {
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
      <ServerSidebar server={serverState} user={user} />

      {channelId && currentChannel ? (
        <Channel
          messages={messages}
          channel={currentChannel}
          user={user}
          members={serverState.members}
        />
      ) : (
        <NoTextChannels />
      )}
    </div>
  );
};

export default ServerChannelClient;
