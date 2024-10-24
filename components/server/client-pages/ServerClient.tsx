"use client";

import { ServerType } from "@/types/server";
import ServerSidebar from "@/components/server/ServerSidebar";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import NoTextChannels from "@/components/server/NoTextChannels";
import { useSocket } from "@/app/providers/SocketProvider";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/db/getUser";
import { getServer } from "@/lib/db/getServer";

type ServerClientProps = {
  server: ServerType;
};

const ServerClient = ({ server }: ServerClientProps) => {
  const { user, setUser } = useUser();
  if (!user) redirect("/");

  const [serverState, setServerState] = useState(server);

  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;

    socket.on("update-user", async () => {
      const updatedUser = await getUser(user.id);

      if (updatedUser !== null) {
        setUser(updatedUser);
      }
    });

    socket.on("update-online-status", (isOnline: boolean) => {
      setUser({ ...user, online: isOnline });
    });

    socket.on("update-server", async () => {
      const updatedServer = await getServer(server._id, user.id);

      if (updatedServer) {
        setServerState(updatedServer);
      } else {
        router.push("/");
      }
    });

    return () => socket.disconnect();
  }, [socket]);

  return (
    <div className="flex grow overflow-hidden h-full">
      <ServerSidebar server={serverState} user={user} />

      <NoTextChannels />
    </div>
  );
};

export default ServerClient;
