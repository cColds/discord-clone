"use client";
import { UserType } from "@/types/user";
import UserPanel from "@/components/panels/UserPanel";
import PrivateChannels from "@/components/sidebars/PrivateChannels";
import DmChannel from "./DmChannel";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";
import { MessageType } from "@/types/message";
import { useSocket } from "@/app/providers/SocketProvider";
import { useEffect } from "react";
import { getUser } from "@/lib/db/getUser";
import { getMessages } from "@/lib/db/getMessages";
import { sortOpenDms } from "@/utils/helpers/sortOpenDms";
import { readMessages } from "@/lib/db/readMessages";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

type DmPageClientType = {
  recipient: UserType;
  pendingRequests: number;
  initialMessages: MessageType[];
  channelId: string;
};

export default function DmPageClient({
  pendingRequests,
  recipient,
  initialMessages,
  channelId,
}: DmPageClientType) {
  const { user, setUser } = useUser();
  if (!user) redirect("/");

  const dms = sortOpenDms(user.dms);
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["messages", channelId],
      queryFn: ({ pageParam }) => getMessages(channelId, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length) return allPages.length;
      },
      initialData: { pages: [initialMessages], pageParams: [0] },
    });

  useEffect(() => {
    if (!socket) return;

    const updateReadMessages = async () => {
      await readMessages(user.id, channelId);
      socket.emit("mark-messages-as-read", user.id);
    };

    updateReadMessages();

    return () => socket.off("mark-messages-as-read");
  }, [socket, data]);

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
      await queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
    });

    socket.on("update-dms-list", async () => {
      const updatedUser = await getUser(user.id);

      if (updatedUser) {
        setUser(updatedUser);
      }
    });

    return () => socket.disconnect();
  }, [socket]);

  const messages = data.pages.toReversed().flatMap((page) => page);

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

      <DmChannel
        user={user}
        recipient={recipient}
        messages={messages}
        fetchNextPage={fetchNextPage}
        channelId={channelId}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}
