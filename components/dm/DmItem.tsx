"use client";

import { cn } from "@/lib/utils";
import AvatarMask from "../avatar/AvatarMask";
import Link from "next/link";
import { Status } from "@/types/status";
import ActionTooltip from "../tooltip/ActionTooltip";
import { useState } from "react";
import { Close } from "../svgs";
import { useParams } from "next/navigation";

type DmItemProps = {
  displayName: string;
  status: Status;
  avatar: string;
  id: string;
};

export default function DmItem({
  id,
  displayName,
  status,
  avatar,
}: DmItemProps) {
  const [showTooltip, setShowTooltip] = useState("");
  const handleMouseOver = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const el = e.currentTarget;

    const widthOverflow = el.offsetWidth < el.scrollWidth;
    setShowTooltip(widthOverflow ? id : "");
  };

  const params = useParams();

  return (
    <li
      className={cn(
        "flex cursor-pointer mx-2 my-[1px] rounded-[4px] h-11 hover:text-interactive-hover hover:bg-background-interactive-hover group text-channels-default max-w-[222px]",
        {
          "text-white": params.channelId === id,
          "bg-background-modifier-selected": params.channelId === id,
        }
      )}
    >
      <Link
        href={`/channels/dms/${id}`}
        className="flex items-center gap-3 px-2 overflow-hidden grow"
      >
        <div className="flex justify-center items-center shrink-0">
          <div className="w-8 h-8">
            <AvatarMask
              username={displayName}
              status={status}
              avatar={avatar}
            />
          </div>
        </div>

        {showTooltip === id ? (
          <ActionTooltip content={displayName}>
            <div
              className={cn("overflow-hidden", {
                "text-white": false,
              })}
            >
              <p className="truncate" onMouseOver={handleMouseOver}>
                {displayName}
              </p>
            </div>
          </ActionTooltip>
        ) : (
          <div
            className={cn("overflow-hidden", {
              "text-white": false,
            })}
          >
            <p className="truncate" onMouseOver={handleMouseOver}>
              {displayName}
            </p>
          </div>
        )}
      </Link>
      <button
        className="hidden group-hover:block hover:text-interactive-hover text-channels-default pr-2 m-0.5 border-0"
        aria-label="Close DM"
      >
        <Close className="w-4 h-4" />
      </button>
    </li>
  );
}
