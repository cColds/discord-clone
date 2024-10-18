"use client";

import { ChevronDown } from "lucide-react";
import { Event } from "../svgs";
import { ServerType } from "@/types/server";
import { UserType } from "@/types/user";
import UserPanel from "../panels/UserPanel";
import React from "react";
import ServerChannelList from "./ServerChannelList";
import ServerCategory from "./ServerCategory";
import ServerDropdown from "./ServerDropdown";

type ServerSidebarProps = {
  server: ServerType;
  user: UserType;
};

const ServerSidebar = ({ server, user }: ServerSidebarProps) => {
  return (
    <div className="flex flex-col min-h-0 w-[240px] flex-shrink-0 overflow-hidden bg-background-secondary">
      <nav
        aria-label={`${server.serverName} server`}
        className="grow flex flex-col items-stretch flex-start min-h-0"
      >
        <div className="cursor-pointer">
          <ServerDropdown server={server} user={user}>
            <header className="hover:bg-background-modifier-hover py-3 px-4 z-30 shadow-elevation-low transition duration-100 ease-linear">
              <div className="h-6 flex items-center justify-between text-header-primary">
                <h2 className="truncate font-bold text-md leading-5 min-w-0">
                  {server.serverName}
                </h2>
                <ChevronDown className="w-[18px] h-[18px] ml-1 opacity-80 shrink-0" />
              </div>
            </header>
          </ServerDropdown>

          <div className="min-w-0 grow pr-2">
            <ul className="" aria-label="Channels">
              <li className="py-[1px] group mt-3">
                <div className="min-h-[32px] cursor-pointer py-1.5 px-2 ml-2 rounded-sm flex justify-center items-center hover:bg-background-modifier-hover transition duration-100">
                  <div className="mr-1.5">
                    <Event className="block w-5 h-5 shrink-0 text-channel-icon" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="text-channels-default truncate text-md leading-5 grow group-hover:text-interactive-hover"
                  >
                    Events
                  </div>
                </div>
              </li>

              <div className="h-[1px] mt-[11px] ml-2 bg-background-modifier-accent" />

              {server.channels.map((channel) => {
                return (
                  <ServerChannelList
                    channel={channel}
                    server={server}
                    key={channel._id}
                  />
                );
              })}

              {server.categories.map((category) => {
                return (
                  <React.Fragment key={category._id}>
                    <ServerCategory
                      category={category}
                      key={category._id}
                      serverId={server._id}
                    />
                    {category.channels.map((channel) => {
                      return (
                        <ServerChannelList
                          channel={channel}
                          server={server}
                          key={channel._id}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <UserPanel
        username={user.username}
        displayName={user.displayName}
        email={user.email}
        status={user.status}
        avatar={user.avatar}
      />
    </div>
  );
};

export default ServerSidebar;
