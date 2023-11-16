"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DiscordLogo, Plus } from "../svgs";
import { cn } from "@/lib/utils";
import Pill from "../pill/Pill";

export default function ServerNav() {
  const params = useParams();
  const router = useRouter();
  const [hoveredServer, setHoveredServer] = useState("");
  const [hoveredAddServer, setHoveredAddServer] = useState(false);

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

  const onClick = (serverId: string) => {
    if (serverId === "/") router.push("/");
    else router.push(`/servers/${serverId}`);
  };
  return (
    <nav
      className="min-w-[72px] bg-background-tertiary h-full overflow-auto"
      aria-label="Servers sidebar"
    >
      <ul className="py-3">
        <div className="flex justify-center relative mb-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  "flex justify-center w-12 h-12 items-center rounded-[50%] transition-all duration-100 bg-dark-700 hover:cursor-pointer hover:bg-primary hover:rounded-xl",
                  {
                    "bg-primary": params.serverId === undefined,
                    "rounded-xl": params.serverId === undefined,
                  }
                )}
                aria-label="Direct Messages"
                onClick={() => onClick("/")}
                onMouseOver={() => setHoveredServer("/")}
                onMouseLeave={() => setHoveredServer("")}
              >
                <DiscordLogo />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-bold">Direct Messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {(hoveredServer === "/" || params.serverId === undefined) && (
            <Pill selected={!params.serverId} />
          )}
        </div>

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
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger
                      className={cn(
                        "flex justify-center w-12 h-12 items-center rounded-[50%] transition-all duration-100 cursor-pointer hover:rounded-xl overflow-clip",
                        { "rounded-xl": params.serverId === server.id }
                      )}
                      aria-label={server.name}
                      onClick={() => onClick(server.id)}
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
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-bold">{server.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {(hoveredServer === server.id || currentServerSelected) && (
                  <Pill selected={currentServerSelected} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
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
              </TooltipTrigger>
              <TooltipContent side="right">Add a Server</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </ul>
    </nav>
  );
}
