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

const getPendingRequests = (user: UserType) =>
  user.social.pending.filter((pending) => pending.request === "Incoming")
    .length;

type ServerItemsType = {
  user: UserType;
  servers: ServerNavItem[];
};

export default function ServerItems({ user, servers }: ServerItemsType) {
  const params = useParams<{ channelId: string; serverId?: string }>();
  const [hoveredServer, setHoveredServer] = useState("");
  const [hoveredAddServer, setHoveredAddServer] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(
    getPendingRequests(user)
  );
  const [serversState, setServersState] = useState(servers);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const fetchUnreadCounts = async () => {
    try {
      const results = await getUnreadMessages(user.id);

      const counts = results.reduce<Record<string, number>>((acc, item) => {
        acc[item.channelId] = item.unreadCount;
        return acc;
      }, {});

      // todo: Should probably return the count and set it after
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error fetching unread message counts:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();
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

    socket.on("receive-unread-messages", async () => {
      console.log("Receive notification");

      fetchUnreadCounts();
    });

    socket.on("message-read-confirmation", async () => {
      console.log("Marking messages as read..");

      await readMessages(user.id, params.channelId);
      fetchUnreadCounts();
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

        {user && <UnreadDMs channels={user.dms} unreadCounts={unreadCounts} />}
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
