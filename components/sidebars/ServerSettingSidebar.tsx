import { ServerSettingsTabs } from "@/types/server-settings-tabs";
import ServerSettingsTabItem from "@/components/ui/ServerSettingsTabItem";
import { ServerType } from "@/types/server";

type ServerSettingsSidebarProps = {
  selected: ServerSettingsTabs;
  onTabClick: (tabName: ServerSettingsTabs) => void;
  server: ServerType;
};

const ServerSettingsSidebar = ({
  selected,
  onTabClick,
  server,
}: ServerSettingsSidebarProps) => {
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
        </nav>
      </div>
    </div>
  );
};

export default ServerSettingsSidebar;
