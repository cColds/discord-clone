import { UserSettingsTabs } from "@/types/user-settings-tabs";
import TabItem from "@/components/ui/TabItem";
import { LogOut } from "../svgs/LogOut";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LogOutModal from "../modals/user-settings/LogOutModal";

type UserSettingsSidebarProps = {
  selected: UserSettingsTabs;
  onTabClick: (tabName: UserSettingsTabs) => void;
};

const UserSettingsSidebar = ({
  selected,
  onTabClick,
}: UserSettingsSidebarProps) => {
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <div className="bg-background-secondary flex-grow overflow-x-hidden overflow-y-scroll flex w-[218px]">
        <nav
          className="py-[60px] pl-5 pr-1.5 flex flex-col w-[218px]"
          role="tablist"
          aria-orientation="vertical"
          aria-label="User Settings"
        >
          <div className="py-1.5 px-2.5 text-channels-default">
            <h2 className="text-xs font-bold tracking-wide uppercase truncate">
              User Settings
            </h2>
          </div>
          <TabItem
            selected={selected === "My Account"}
            name="My Account"
            onTabClick={onTabClick}
          />
          <TabItem
            selected={selected === "Profiles"}
            name="Profiles"
            onTabClick={onTabClick}
          />

          <div className="h-[1px] bg-background-modifier-accent mx-2.5 my-2" />

          <li className="list-none w-full">
            <button
              aria-label="Log Out"
              className={cn(
                "flex justify-between items-center text-left w-full py-1.5 px-2.5 mb-0.5 rounded text-md leading-5 truncate list-none text-interactive-normal cursor-pointer hover:text-interactive-hover hover:bg-background-modifier-hover"
              )}
              onClick={() => setLogOutModalOpen(true)}
            >
              Log Out
              <LogOut />
            </button>
          </li>

          <LogOutModal
            open={logOutModalOpen}
            toggleModal={setLogOutModalOpen}
          />
        </nav>
      </div>
    </div>
  );
};

export default UserSettingsSidebar;
