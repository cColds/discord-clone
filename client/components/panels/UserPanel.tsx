import { Deafen, Mic, Settings } from "../svgs";
import ActionTooltip from "../tooltip/ActionTooltip";
import { Status } from "@/types/status";
import AvatarMask from "../avatar/AvatarMask";

type UserPanelProps = {
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  status: Status;
};

export default function UserPanel({
  username,
  displayName,
  email,
  avatar,
  status,
}: UserPanelProps) {
  return (
    <section className="bg-background-secondary-alt" aria-label="User area">
      <div className="mb-[1px] px-2 text-sm h-[52px] flex items-center font-medium">
        <button
          aria-label="Set Status"
          className="flex min-w-[120px] items-center gap-2 hover:bg-background-modifier-selected rounded-[4px] grow"
        >
          <div className="w-8 h-8">
            <AvatarMask username={username} status={status} avatar={avatar} />
          </div>

          <div className="py-1 mr-1 overflow-hidden">
            <div>
              <p className="text-left truncate">{username}</p>
            </div>
            <div className="text-left text-xs text-header-secondary">
              <p className="truncate">{status}</p>
            </div>
          </div>
        </button>

        <div className="flex">
          <ActionTooltip content="Mute">
            <button
              className="text-interactive-normal hover:bg-background-modifier-selected w-8 h-8 flex justify-center items-center hover:text-interactive-hover"
              aria-label="Mute"
            >
              <Mic />
            </button>
          </ActionTooltip>

          <ActionTooltip content="Deafen">
            <button
              className="text-interactive-normal hover:bg-background-modifier-selected w-8 h-8 flex justify-center items-center hover:text-interactive-hover"
              aria-label="Deafen"
            >
              <Deafen />
            </button>
          </ActionTooltip>

          <ActionTooltip content="User Settings">
            <button
              className="text-interactive-normal hover:bg-background-modifier-selected w-8 h-8 flex justify-center items-center hover:text-interactive-hover"
              aria-label="User Settings"
            >
              <Settings />
            </button>
          </ActionTooltip>
        </div>
      </div>
    </section>
  );
}
