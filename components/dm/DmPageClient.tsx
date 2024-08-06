"use client";

import { UserType } from "@/types/user";
import UserPanel from "@/components/panels/UserPanel";
import PrivateChannels from "@/components/sidebars/PrivateChannels";
import DmChannel from "./DmChannel";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";
import { useSocket } from "@/app/providers/SocketProvider";
import { useEffect } from "react";
import { getUser } from "@/lib/db/getUser";
import { getMessages } from "@/lib/db/getMessages";
import { sortOpenDms } from "@/utils/helpers/sortOpenDms";
import { useMessages } from "@/app/providers/MessageProvider";

type DmPageClientType = {
  recipient: UserType;
  pendingRequests: number;
  channelId: string;
};

export default function DmPageClient({
  pendingRequests,
  recipient,
  channelId,
}: DmPageClientType) {
  const { messages, setMessages } = useMessages();

  const { user, setUser } = useUser();
  if (!user) redirect("/");

  const dms = sortOpenDms(user.dms);
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
      const updatedMessages = await getMessages(25, channelId);

      setMessages(updatedMessages);

      console.log("success state change");
    });

    socket.on("scroll-to-bottom-chat", () => {
      console.log("this should scroll to bottom!");
    });

    socket.on("update-dms-list", async () => {
      const updatedUser = await getUser(user.id);

      if (updatedUser) {
        setUser(updatedUser);
      }
    });

    return () => socket.disconnect();
  }, [socket]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels pendingRequests={pendingRequests} dms={dms} />
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
