import { cn } from "@/lib/utils";
import { Friend, Help, Inbox, NewGroupDM } from "../svgs";
import ActionTooltip from "../tooltip/ActionTooltip";
import { FriendTab } from "@/types/friend-tab";

type TabButtonProps = {
  children: React.ReactNode;
  selected: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const TabButton = ({
  children,
  className,
  selected,
  ...props
}: TabButtonProps) => {
  return (
    <button
      className={cn(
        "px-2 py-0.5 rounded-sm hover:bg-background-interactive-hover hover:text-interactive-hover border-0 leading-5",
        className,
        {
          "cursor-default": selected,
          "font-bold": selected,
          "bg-background-modifier-selected": selected,
          "text-white": selected,
        }
      )}
      role="tab"
      {...props}
    >
      {children}
    </button>
  );
};

type ToolbarIconProps = {
  children: React.ReactNode;
  name: string;
};

const ToolbarIcon = ({ children, name }: ToolbarIconProps) => {
  return (
    <ActionTooltip content={name} side="bottom">
      <button
        aria-label={name}
        className="text-interactive-normal hover:text-interactive-hover mx-2"
      >
        {children}
      </button>
    </ActionTooltip>
  );
};

type FriendsTabProps = {
  onTabClick: (tabType: FriendTab) => void;
  tab: FriendTab;
};

export default function FriendsTab({ onTabClick, tab }: FriendsTabProps) {
  return (
    <nav className="flex justify-between p-2 shadow-elevation-low min-h-[48px]">
      <div className="flex items-center">
        <div className="text-channel-icon mx-2">
          <Friend />
        </div>

        <h1 className="font-semibold text-header-primary mr-2">Friends</h1>

        <div className="bg-background-modifier-accent w-[1px] h-6 mx-2" />

        <div
          role="tablist"
          aria-orientation="horizontal"
          aria-label="Friends"
          className="flex items-center gap-2 text-interactive-normal"
        >
          <TabButton
            onClick={() => onTabClick("Online")}
            className="ml-2"
            selected={tab === "Online"}
          >
            Online
          </TabButton>
          <TabButton selected={tab === "All"} onClick={() => onTabClick("All")}>
            All
          </TabButton>
          <TabButton
            selected={tab === "Pending"}
            onClick={() => onTabClick("Pending")}
          >
            Pending
          </TabButton>
          <TabButton
            selected={tab === "Blocked"}
            onClick={() => onTabClick("Blocked")}
          >
            Blocked
          </TabButton>

          <button
            className={cn(
              "py-0.5 px-2 mr-2 rounded-sm bg-status-positive-background text-white font-semibold border-0 leading-5",
              {
                "bg-transparent": tab === "Add Friend",
                "text-positive": tab === "Add Friend",
                "cursor-default": tab === "Add Friend",
              }
            )}
            role="tab"
            onClick={() => onTabClick("Add Friend")}
          >
            Add Friend
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <ToolbarIcon name="New Group DM">
          <NewGroupDM />
        </ToolbarIcon>

        <ToolbarIcon name="Inbox">
          <Inbox />
        </ToolbarIcon>

        <ToolbarIcon name="Help">
          <Help />
        </ToolbarIcon>
      </div>
    </nav>
  );
}
