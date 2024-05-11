"use client";
import { DmType, UserType } from "@/types/user";
import UserPanel from "@/components/panels/UserPanel";
import PrivateChannels from "@/components/sidebars/PrivateChannels";
import DmChannel from "./DmChannel";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";
import { MessageType } from "@/types/message";
import { useSocket } from "@/app/providers/SocketProvider";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/db/getUser";
import { getMessages } from "@/lib/db/getMessages";

type DmPageClientType = {
  recipient: UserType;
  pendingRequests: number;
  dmsOpen: {
    channel: DmType;
    recipient: UserType;
    open: boolean;
    id: string;
  }[];
  initialMessages: MessageType[];
  channelId: string;
};

export default function DmPageClient({
  pendingRequests,
  dmsOpen,
  recipient,
  initialMessages,
  channelId,
}: DmPageClientType) {
  const [messages, setMessages] = useState(initialMessages);

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
      // fetch new messages
      const updatedMessages = await getMessages(25, channelId);

      setMessages(updatedMessages);

      console.log("success state change");
    });

    socket.on("scroll-to-bottom-chat", () => {
      console.log("this should scroll to bottom!");
    });

    return () => socket.disconnect();
  }, [socket]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels pendingRequests={pendingRequests} dms={dmsOpen} />
        <UserPanel
          username={user.username}
          displayName={user.displayName}
          email={user.email}
          avatar={user.avatar}
          status={user.status}
        />
      </div>

      <DmChannel user={user} recipient={recipient} messages={messages} />
    </div>
  );
}
