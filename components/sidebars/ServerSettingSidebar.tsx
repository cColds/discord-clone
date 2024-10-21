import { ServerSettingsTabs } from "@/types/server-settings-tabs";
import ServerSettingsTabItem from "@/components/ui/ServerSettingsTabItem";
import { ServerType } from "@/types/server";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Trash } from "@/components/svgs";
import DeleteServerModal from "@/components/modals/server/DeleteServerModal";
import { UserType } from "@/types/user";

type ServerSettingsSidebarProps = {
  selected: ServerSettingsTabs;
  onTabClick: (tabName: ServerSettingsTabs) => void;
  server: ServerType;
  user: UserType;
};

const ServerSettingsSidebar = ({
  selected,
  onTabClick,
  server,
  user,
}: ServerSettingsSidebarProps) => {
  const [deleteServerModalOpen, setDeleteServerModalOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <div className="bg-background-secondary flex-grow overflow-x-hidden overflow-y-scroll flex w-[218px]">
        <nav
          className="py-[60px] pl-5 pr-1.5 flex flex-col w-[218px]"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Server Settings"
        >
          <div className="py-1.5 px-2.5 text-channels-default">
            <h2 className="text-xs font-bold tracking-wide uppercase truncate">
              {server.serverName}
            </h2>
          </div>
          <ServerSettingsTabItem
            selected={selected === "Overview"}
            name="Overview"
            onTabClick={onTabClick}
          />
          <ServerSettingsTabItem
            selected={selected === "Members"}
            name="Members"
            onTabClick={onTabClick}
          />
          <div className="h-[1px] bg-background-modifier-accent mx-2.5 my-2" />
          <li className="list-none w-full">
            <button
              className={cn(
                "flex justify-between items-center text-left w-full py-1.5 px-2.5 mb-0.5 rounded text-md leading-5 truncate list-none text-interactive-normal cursor-pointer hover:text-interactive-hover hover:bg-background-modifier-hover"
              )}
              onClick={() => setDeleteServerModalOpen(true)}
            >
              Delete Server
              <Trash className="w-4 h-4" />
            </button>
          </li>
        </nav>
      </div>

      <DeleteServerModal
        open={deleteServerModalOpen}
        toggleModal={setDeleteServerModalOpen}
        server={server}
        user={user}
      />
    </div>
  );
};

export default ServerSettingsSidebar;
