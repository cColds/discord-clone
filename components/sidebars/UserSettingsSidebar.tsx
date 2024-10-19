import { UserSettingsTabs } from "@/types/user-settings-tabs";
import TabItem from "@/components/ui/TabItem";

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
