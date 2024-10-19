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
          "text-left w-full py-1.5 px-2.5 mb-0.5 rounded text-md leading-5 truncate list-none text-interactive-normal cursor-pointer hover:text-interactive-hover hover:bg-background-modifier-hover",
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

export default TabItem;
