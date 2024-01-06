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
    if (socket) {
      socket.on("receive-friend-request", async () => {
        const receiverUser = await getUser(user.id);

        if (receiverUser !== null) {
          setUser(receiverUser);
          console.log("updated friends list");
        }
      });

      return () => socket.disconnect();
    }
  }, [socket, user]);

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
