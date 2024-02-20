"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Plus } from "../svgs";
import { cn } from "@/lib/utils";
import Pill from "../pill/Pill";
import ActionTooltip from "../tooltip/ActionTooltip";
import Link from "next/link";
import Notification from "../badges/Notification";
import HomeLink from "./HomeLink";

const servers = [
  {
    name: "test",
    id: "uijohasfdoias",
    icon: "https://picsum.photos/seed/AUvOnuoS9O/512/512",
  },
  {
    name: "cool",
    id: "t98uj9io",
    icon: "https://picsum.photos/seed/nKHk5uO/512/512",
  },
  {
    name: "bobby bojangles",
    id: "ijegr23",
    icon: "https://picsum.photos/seed/x53NK0a2/512/512",
  },
];

export default function ServerItems({
  incomingRequests,
}: {
  incomingRequests: number;
}) {
  const params = useParams();
  const [hoveredServer, setHoveredServer] = useState("");
  const [hoveredAddServer, setHoveredAddServer] = useState(false);

  return (
    <nav
      className="min-w-[72px] bg-background-tertiary h-full overflow-auto"
      aria-label="Servers sidebar"
    >
      <ul className="py-3">
        <HomeLink
          incomingRequests={incomingRequests}
          serverId={params.serverId}
          hoveredServer={hoveredServer}
          setHoveredServer={setHoveredServer}
        />

        <div className="h-0.5 w-8 bg-background-modifier-accent mb-2 mx-auto"></div>

        <div className="flex flex-col items-center" aria-label="Servers">
          {servers.map((server) => {
            const currentServerSelected: boolean =
              params.serverId === server.id;

            return (
              <div
                className="flex justify-center relative w-full mb-2"
                key={server.id}
              >
                <ActionTooltip content={server.name} side="right">
                  <Link
                    href={`/channels/servers/${server.id}`}
                    className={cn(
                      "flex justify-center w-12 h-12 items-center rounded-[50%] transition-all duration-100 cursor-pointer hover:rounded-xl overflow-clip",
                      { "rounded-xl": params.serverId === server.id }
                    )}
                    aria-label={server.name}
                    onMouseOver={() => setHoveredServer(server.id)}
                    onMouseLeave={() => setHoveredServer("")}
                  >
                    <Image
                      src={server.icon}
                      alt=""
                      width={48}
                      height={48}
                      className="aspect-square min-w-[48px] min-h-[48px]"
                      aria-label="hidden"
                    />
                  </Link>
                </ActionTooltip>

                {(hoveredServer === server.id || currentServerSelected) && (
                  <Pill selected={currentServerSelected} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <ActionTooltip content="Add a Server" side="right">
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
          </ActionTooltip>
        </div>
      </ul>
    </nav>
  );
}
