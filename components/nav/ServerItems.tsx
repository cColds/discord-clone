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
import UnreadDMs from "./UnreadDMs";
import { getUnreadMessages } from "@/lib/db/getUnreadMessages";
import { readMessages } from "@/lib/db/readMessages";
import { UnreadCount } from "@/types/UnreadCount";
import { useMotionValue } from "framer-motion";
import { useFlubber } from "@/hooks/useFlubber";
import { circle, roundedCircle } from "@/utils/constants/svgPaths";

const getPendingRequests = (user: UserType) =>
  user.social.pending.filter((pending) => pending.request === "Incoming")
    .length;

type ServerItemsType = {
  user: UserType;
  servers: ServerNavItem[];
};

const paths = [circle, roundedCircle];

export default function ServerItems({ user, servers }: ServerItemsType) {
  const params = useParams<{ channelId: string; serverId?: string }>();
  const [hoveredServer, setHoveredServer] = useState("");

  const [lastHoveredServer, setLastHoveredServer] = useState("");
  const [pendingRequests, setPendingRequests] = useState(
    getPendingRequests(user)
  );
  const [serversState, setServersState] = useState(servers);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount[]>([]);

  const fetchUnreadCounts = async () => {
    try {
      const results = await getUnreadMessages(user.id);

      const counts = results.map((item) => ({
        count: item.unreadCount,
        channelId: item.channelId,
      }));

      return counts;
    } catch (error) {
      console.error("Error fetching unread message counts:", error);
    }
  };

  const handleHoveredServer = (serverId: string) => {
    setHoveredServer(serverId);
    if (serverId !== "") {
      setLastHoveredServer(serverId);
    }
  };

  useEffect(() => {
    fetchUnreadCounts().then((updatedUnreadCounts) => {
      if (updatedUnreadCounts) setUnreadCounts(updatedUnreadCounts);
    });
  }, []);

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

    socket.on("update-server", async () => {
      const updatedServers = await getServers(user.id);
      if (updatedServers) {
        setServersState(updatedServers);
      }
    });

    socket.on("leave-server", async () => {
      const updatedServers = await getServers(user.id);

      if (updatedServers) {
        setServersState(updatedServers);
      }
    });

    socket.on("receive-unread-messages", async () => {
      const updatedUnreadCounts = await fetchUnreadCounts();

      if (updatedUnreadCounts) setUnreadCounts(updatedUnreadCounts);
    });

    socket.on("message-read-confirmation", async () => {
      await readMessages(user.id, params.channelId);
      const updatedUnreadCounts = await fetchUnreadCounts();

      if (updatedUnreadCounts) setUnreadCounts(updatedUnreadCounts);
    });

    return () => socket.disconnect();
  }, [socket]);

  const progress = useMotionValue(0);
  const path = useFlubber(progress, paths);

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
          options={{ progress, path }}
          onHoveredServer={handleHoveredServer}
        />

        {user && (
          <UnreadDMs
            channels={user.dms}
            unreadCounts={unreadCounts}
            onHoveredServer={handleHoveredServer}
            options={{ progress, path }}
          />
        )}
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
                onHoveredServer={handleHoveredServer}
                server={server}
                key={server._id}
                options={{ progress, path }}
              />
            );
          })}
        </div>
        <div className="flex justify-center">
          <CreateOrJoinServerModal>
            <button
              className={cn(
                "group flex justify-center w-12 h-12 items-center rounded-[50%] transition-all duration-100 cursor-pointer hover:rounded-xl hover:bg-green-360 overflow-clip bg-dark-700"
              )}
            >
              <Plus className="text-green-360 group-hover:text-white" />
            </button>
          </CreateOrJoinServerModal>
        </div>
      </ul>
    </nav>
  );
}
