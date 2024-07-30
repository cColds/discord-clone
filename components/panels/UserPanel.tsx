import { Deafen, Mic, Settings } from "../svgs";
import ActionTooltip from "../tooltip/ActionTooltip";
import { Status } from "@/types/status";
import AvatarMask from "../avatar/AvatarMask";
import { useState } from "react";
import UserSettings from "./UserSettings";

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
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <section className="bg-background-secondary-alt" aria-label="User area">
      <div className="mb-[1px] px-2 text-sm h-[52px] flex items-center font-medium">
        <button
          aria-label="Set Status"
          className="group flex min-w-[120px] items-center gap-2 hover:bg-background-modifier-selected border-0 rounded-[4px] grow -ml-0.5 mr-2 pl-0.5"
        >
          <div className="w-8 h-8">
            <AvatarMask username={username} status={status} avatar={avatar} />
          </div>

          <div className="py-1 mr-1 overflow-hidden grow">
            <div>
              <p className="text-left truncate">{displayName}</p>
            </div>
            <div className="text-left text-xs text-header-secondary">
              <div className="relative overflow-hidden">
                <p className="truncate absolute translate-y-[107%] opacity-0 transition duration-200 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 w-full">
                  {/* NOTE: Text ellipsis only works when the width has a limit. 
                      I think the child's content normally respects the parents container as long as the parent has a limit on its width, even if the child has its width set to auto.
                      But I think in this case, position absolute breaks it because width: auto; is not bounded by the parent anymore.
                      Fixing this just requires the child's width to be static (not auto), or at most the parent's width.
                      Tested max width: 100% and width: 100% works but not min-width: 0, probably because of position absolute.

                      Also more solutions: https://stackoverflow.com/questions/31928710/text-overflow-ellipsis-on-dynamic-width-element
                  */}
                  {username}
                </p>
                <p className="truncate transition duration-200 ease-in-out group-hover:translate-y-[-107%] group-hover:opacity-0">
                  {status}
                </p>
              </div>
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
              onClick={() => setOpenSettings(true)}
            >
              <Settings />
            </button>
          </ActionTooltip>

          {openSettings && (
            <UserSettings onClose={() => setOpenSettings(false)} />
          )}
        </div>
      </div>
    </section>
  );
}
