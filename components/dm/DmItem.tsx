"use client";

import { cn } from "@/lib/utils";
import AvatarMask from "../avatar/AvatarMask";
import Link from "next/link";
import { Status } from "@/types/status";
import ActionTooltip from "../tooltip/ActionTooltip";
import { useState } from "react";
import { CloseDM } from "../svgs";

type DmItemProps = {
  username: string;
  status: Status;
  avatar: string;
  id: string;
};

const UsernameDisplay = ({ username }: { username: string }) => (
  <div
    className={cn("overflow-hidden", {
      "text-white": false,
    })}
  >
    <p className="truncate" data-username="username">
      {username}
    </p>
  </div>
);

export default function DmItem({ id, username, status, avatar }: DmItemProps) {
  const [showTooltip, setShowTooltip] = useState("");
  const handleMouseOver = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.target;
    if (el instanceof HTMLElement && el.dataset.username === "username") {
      const widthOverflow = el.offsetWidth < el.scrollWidth;
      setShowTooltip(widthOverflow ? id : "");
    }
  };

  // TODO:
  // Need to replace the cn classes with selected boolean instead of hardcoded false
  // Get the selected dm via url (need to implement channels/[channelId] route first)

  return (
    <li
      className={cn(
        "flex cursor-pointer mx-2 my-[1px] rounded-[4px] h-11 hover:text-interactive-hover hover:bg-background-interactive-hover group text-channels-default",
        {
          "bg-background-modifier-selected": false,
        }
      )}
    >
      <Link
        href={`/channels/${id}`}
        className="flex items-center gap-3 px-2 overflow-hidden grow"
        onMouseOver={handleMouseOver}
      >
        <div className="flex justify-center items-center shrink-0">
          <div className="w-8 h-8">
            <AvatarMask username={username} status={status} avatar={avatar} />
          </div>
        </div>

        {showTooltip === id ? (
          <ActionTooltip content={username}>
            <UsernameDisplay username={username} />
          </ActionTooltip>
        ) : (
          <UsernameDisplay username={username} />
        )}
      </Link>
      <button
        className="hidden group-hover:block hover:text-interactive-hover text-channels-default pr-2"
        aria-label="Close DM"
      >
        <CloseDM />
      </button>
    </li>
  );
}
