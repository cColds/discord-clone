"use client";

import { useEffect, useState } from "react";
import Friends from "../friends/Friends";
import UserPanel from "../panels/UserPanel";
import PrivateChannels from "../sidebars/PrivateChannels";
import { useSocket } from "@/app/providers/SocketProvider";
import { getUser } from "@/lib/db/getUser";
import { UserType } from "@/types/user";

type HomeProps = {
  sessionUser: UserType;
};

export default function HomeClient({ sessionUser }: HomeProps) {
  const [user, setUser] = useState<UserType>(sessionUser);
  const { socket } = useSocket();

  const pendingRequests = user.social.pending.filter(
    (pending) => pending.request === "Incoming"
  );

  const dmsOpen = user.dms.filter((dm) => dm.open);

  useEffect(() => {
    if (!socket) return;

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
      const updatedUser = await getUser(user.id); // todo/note: maybe quicker to filter through friends and update their online status instead of fetching, but maybe need to pass in friendId param

      if (updatedUser) {
        setUser(updatedUser);
      } else {
        console.error("failed to update user");
      }
    });

    return () => socket.disconnect();
  }, [socket]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels
          pendingRequests={pendingRequests.length}
          dms={dmsOpen}
        />
        <UserPanel
          username={user.username}
          displayName={user.displayName}
          email={user.email}
          avatar={user.avatar}
          status={user.status}
        />
      </div>

      <Friends social={user.social} />
    </div>
  );
}
