import Image from "next/image";
import { Deafan, Mic, Settings } from "../svgs";
import ActionTooltip from "../tooltip/ActionTooltip";

const user = {
  username: "cold",
  avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
  status: "Do Not Disturb",
  id: "r98h",
};

export default function UserPanel() {
  return (
    <section className="bg-background-secondary-alt" aria-label="User area">
      <div className="mb-[1px] px-2 text-sm h-[52px] flex items-center font-medium">
        <button
          aria-label="Set Status"
          className="flex min-w-[120px] items-center gap-2 hover:bg-background-modifier-selected rounded-[4px] grow"
        >
          <div className="w-8 h-8">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <foreignObject
                x="0"
                y="0"
                width="32"
                height="32"
                mask="url(#svg-mask-avatar-status-round-32)"
              >
                <Image
                  src={user.avatar}
                  alt=""
                  aria-hidden="true"
                  width={32}
                  height={32}
                  draggable={false}
                />
              </foreignObject>
              <rect
                width="10"
                height="10"
                x="22"
                y="22"
                fill="#f23f43"
                mask="url(#svg-mask-status-dnd)"
              ></rect>
            </svg>
          </div>

          <div className="py-1 mr-1 overflow-hidden">
            <div>
              <p className="text-left truncate">{user.username}</p>
            </div>
            <div className="text-left text-xs text-header-secondary">
              <p className="truncate">{user.status}</p>
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

          <ActionTooltip content="Deafan">
            <button
              className="text-interactive-normal hover:bg-background-modifier-selected w-8 h-8 flex justify-center items-center hover:text-interactive-hover"
              aria-label="Deafan"
            >
              <Deafan />
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
