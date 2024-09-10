import { UserType } from "@/types/user";
import AvatarMask from "../avatar/AvatarMask";
import UserProfileShape from "../svgs/UserProfileShape";
import ActionTooltip from "../tooltip/ActionTooltip";

type DmHeaderProps = {
  toggleSidebarOpen: () => void;
  sidebarOpen: boolean;
  recipient: UserType;
};

export default function DmHeader({
  sidebarOpen,
  toggleSidebarOpen,
  recipient,
}: DmHeaderProps) {
  return (
    <section
      className="flex items-center min-h-[48px] max-h-[48px] p-2 shadow-elevation-low grow"
      aria-label="Channel Header"
    >
      <div className="flex items-center overflow-hidden grow">
        <div className="ml-2 mr-3 w-6 h-6">
          <AvatarMask
            avatar={recipient.avatar}
            username={recipient.username}
            status={recipient.status}
            svgHeight={30}
            svgWidth={30}
            imgWidth={24}
            imgHeight={24}
            rectWidth={8}
            rectHeight={8}
            rectX={16}
            rectY={16}
          />
        </div>
        <h1 className="font-bold mr-2">{recipient.displayName}</h1>
      </div>

      <div className="flex items-center justify-end overflow-hidden grow">
        <ActionTooltip
          content={sidebarOpen ? "Hide User Profile" : "Show User Profile"}
        >
          <button
            aria-label={sidebarOpen ? "Hide User Profile" : "Show User Profile"}
            className="h-6 mx-2 border-0 group"
            onClick={toggleSidebarOpen}
          >
            <UserProfileShape className="text-interactive-normal group-hover:text-interactive-hover" />
          </button>
        </ActionTooltip>
      </div>
    </section>
  );
}
