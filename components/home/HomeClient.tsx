"use client";

import { useEffect } from "react";
import Friends from "../friends/Friends";
import UserPanel from "../panels/UserPanel";
import PrivateChannels from "../sidebars/PrivateChannels";
import { useSocket } from "@/app/providers/SocketProvider";
import { getUser } from "@/lib/db/getUser";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";
import { sortOpenDms } from "@/utils/helpers/sortOpenDms";

export default function HomeClient() {
  const { user, setUser } = useUser();

  if (!user) redirect("/");

  const { socket } = useSocket();

  const pendingRequests = user.social.pending.filter(
    (pending) => pending.request === "Incoming"
  );

  const dms = sortOpenDms(user.dms);

  useEffect(() => {
    if (!socket) return;

    socket.on("update-online-status", (isOnline: boolean) => {
      setUser({ ...user, online: isOnline });
    });
    socket.on("update-user", async () => {
      const updatedUser = await getUser(user.id);

      if (updatedUser) setUser(updatedUser);
    });

    return () => socket.disconnect();
  }, [socket]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels pendingRequests={pendingRequests.length} dms={dms} />
        <UserPanel
          username={user.username}
          displayName={user.displayName}
          email={user.email}
          avatar={user.avatar}
          status={user.status}
        />
      </div>

      <Friends social={user.social} userId={user.id} />
    </div>
  );
}
