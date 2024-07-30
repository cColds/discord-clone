import { cn } from "@/lib/utils";
import { UserSettingsTabs } from "@/types/user-settings-tabs";

type TabItemProps = {
  name: UserSettingsTabs;
  selected: boolean;
  onTabClick: (tabName: UserSettingsTabs) => void;
};

const TabItem = ({ name, selected, onTabClick }: TabItemProps) => {
  return (
    <li className="list-none w-full">
      <button
        aria-label={name}
        onClick={() => onTabClick(name)}
        aria-selected={selected}
        className={cn(
          " text-left w-full py-1.5 px-2.5 mb-0.5 rounded text-md leading-5 truncate list-none text-interactive-normal cursor-pointer hover:text-interactive-hover hover:bg-background-modifier-hover",
          selected
            ? "bg-background-modifier-selected cursor-default text-interactive-active"
            : ""
        )}
      >
        {name}
      </button>
    </li>
  );
};

type UserSettingsSidebarProps = {
  selected: UserSettingsTabs;
  onTabClick: (tabName: UserSettingsTabs) => void;
};

const UserSettingsSidebar = ({
  selected,
  onTabClick,
}: UserSettingsSidebarProps) => {
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
        </nav>
      </div>
    </div>
  );
};

export default UserSettingsSidebar;
