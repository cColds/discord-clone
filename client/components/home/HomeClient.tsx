"use client";

import { useEffect, useState } from "react";
import Friends from "../friends/Friends";
import UserPanel from "../panels/UserPanel";
import PrivateChannels from "../sidebars/PrivateChannels";
import { SessionUser } from "@/types/SessionUser";
import { SocialPopulated } from "@/types/social";
import { useSocket } from "@/app/providers/SocketProvider";
import { getUser } from "@/lib/db/getUser";

type User = SessionUser & SocialPopulated;

type HomeProps = {
  sessionUser: User;
};

export default function HomeClient({ sessionUser }: HomeProps) {
  const [user, setUser] = useState<User>(sessionUser);
  const { socket } = useSocket();

  const incomingRequests = user.social.pending.filter(
    (pending) => pending.request === "Incoming"
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("update-friend-list", async () => {
      const updatedUser = await getUser(user.id);

      if (updatedUser !== null) {
        setUser(updatedUser);
        console.log("updated friends list");
      }
    });

    return () => socket.disconnect();
  }, [socket]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels incomingRequests={incomingRequests.length} />
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
