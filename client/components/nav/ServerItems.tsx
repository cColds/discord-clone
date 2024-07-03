"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus } from "../svgs";
import { cn } from "@/lib/utils";
import Pill from "../pill/Pill";
import ActionTooltip from "../tooltip/ActionTooltip";
import Link from "next/link";
import HomeLink from "./HomeLink";
import { useSocket } from "@/app/providers/SocketProvider";
import { UserType } from "@/types/user";
import { getUser } from "@/lib/db/getUser";
import CreateOrJoinServerModal from "../modals/CreateOrJoinServerModal";
import { ServerNavItem } from "@/types/server";
import { transformCloudinaryUrl } from "@/utils/helpers/transformCloudinaryUrl";
import { getServers } from "@/lib/db/getServers";

const getPendingRequests = (user: UserType) =>
  user.social.pending.filter((pending) => pending.request === "Incoming")
    .length;

type ServerItemsType = {
  user: UserType;
  servers: ServerNavItem[];
};

export default function ServerItems({ user, servers }: ServerItemsType) {
  const params = useParams();
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
            const currentServerSelected: boolean =
              params.serverId === server._id;

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
              <div
                className="flex justify-center relative w-full mb-2"
                key={server._id}
              >
                <ActionTooltip content={server.serverName} side="right">
                  <Link
                    href={`/channels/servers/${server._id}`}
                    className={cn(
                      "flex justify-center w-12 h-12 items-center rounded-[50%] cursor-pointer hover:rounded-xl overflow-clip text-text-normal hover:text-white hover:bg-brand-500 transition duration-150 ease-out bg-background-primary",
                      { "rounded-xl": params.serverId === server._id }
                    )}
                    aria-label={server.serverName}
                    onMouseOver={() => setHoveredServer(server._id)}
                    onMouseLeave={() => setHoveredServer("")}
                  >
                    {server?.icon ? (
                      <Image
                        src={url}
                        alt=""
                        width={48}
                        height={48}
                        className="aspect-square min-w-[48px] min-h-[48px] object-cover"
                        aria-label="hidden"
                      />
                    ) : (
                      <div className="leading-[1.2em] font-semibold whitespace-nowrap w-12 h-12 flex items-center justify-center">
                        {acronym}
                      </div>
                    )}
                  </Link>
                </ActionTooltip>

                {(hoveredServer === server._id || currentServerSelected) && (
                  <Pill selected={currentServerSelected} />
                )}
              </div>
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
