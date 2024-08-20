"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "../svgs";
import { cn } from "@/lib/utils";
import HomeLink from "./HomeLink";
import { useSocket } from "@/app/providers/SocketProvider";
import { UserType } from "@/types/user";
import { getUser } from "@/lib/db/getUser";
import CreateOrJoinServerModal from "../modals/CreateOrJoinServerModal";
import { ServerNavItem } from "@/types/server";
import { transformCloudinaryUrl } from "@/utils/helpers/transformCloudinaryUrl";
import { getServers } from "@/lib/db/getServers";
import ListItem from "./ListItem";

const getPendingRequests = (user: UserType) =>
  user.social.pending.filter((pending) => pending.request === "Incoming")
    .length;

type ServerItemsType = {
  user: UserType;
  servers: ServerNavItem[];
};

export default function ServerItems({ user, servers }: ServerItemsType) {
  const params = useParams<{ serverId?: string }>();
  const [hoveredServer, setHoveredServer] = useState("");
  const [hoveredAddServer, setHoveredAddServer] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(
    getPendingRequests(user)
  );
  const [serversState, setServersState] = useState(servers);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("update-friend-list", async () => {
      const updatedUser = await getUser(user.id);

      if (updatedUser !== null) {
        const pendingAmount = getPendingRequests(updatedUser);
        setPendingRequests(pendingAmount);
      }
    });

    socket.on("join-server", async () => {
      const updatedServers = await getServers(user.id);

      if (updatedServers) {
        setServersState(updatedServers);
      }
    });

    socket.on("create-server", async () => {
      const updatedServers = await getServers(user.id);

      if (updatedServers) {
        setServersState(updatedServers);
      }
    });

    return () => socket.disconnect();
  }, [socket]);

  return (
    <nav
      className="min-w-[72px] bg-background-tertiary h-full overflow-auto hide-scroller"
      aria-label="Servers sidebar"
    >
      <ul className="py-3">
        <HomeLink
          pendingRequests={pendingRequests}
          serverId={params.serverId}
          hoveredServer={hoveredServer}
          setHoveredServer={setHoveredServer}
        />

        <div className="h-0.5 w-8 bg-background-modifier-accent mb-2 mx-auto"></div>

        <div className="flex flex-col items-center" aria-label="Servers">
          {serversState.map((server) => {
            const isSelectedServer = params.serverId === server._id;

            const acronym = !server.icon
              ? server.serverName
                  .split(/\s/)
                  .reduce(
                    (response, word) => (response += word.slice(0, 1)),
                    ""
                  )
              : "";

            const transformation = "c_fill,h_96,w_96";

            let url = server.icon
              ? transformCloudinaryUrl(server.icon, transformation)
              : "";

            return (
              <ListItem
                url={url}
                isSelectedServer={isSelectedServer}
                acronym={acronym}
                hoveredServer={hoveredServer}
                onHoveredServer={(serverId: string) =>
                  setHoveredServer(serverId)
                }
                server={server}
                key={server._id}
              />
            );
          })}
        </div>

        <div className="flex justify-center">
          <CreateOrJoinServerModal>
            <button
              className={cn(
                "flex justify-center w-12 h-12 items-center rounded-[50%] transition-all duration-100 cursor-pointer hover:rounded-xl overflow-clip bg-dark-700",
                {
                  "rounded-xl": hoveredAddServer,
                  "bg-green-360": hoveredAddServer,
                }
              )}
              onMouseOver={() => setHoveredAddServer(true)}
              onMouseLeave={() => setHoveredAddServer(false)}
            >
              <Plus
                className={hoveredAddServer ? "text-white" : "text-green-360"}
              />
            </button>
          </CreateOrJoinServerModal>
        </div>
      </ul>
    </nav>
  );
}
