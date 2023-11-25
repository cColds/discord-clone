"use client";

import Link from "next/link";
import { CloseDM, DMPlus, Friend, Nitro, Shop } from "../svgs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import ActionTooltip from "../tooltip/ActionTooltip";
import { Status } from "@/types/status";
import { STATUS } from "@/constants";

type Dms = {
  username: string;
  avatar: string;
  status: Status;
  id: string;
}[];

const dms: Dms = [
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r98h",
  },
  {
    username: "Harmeet Matharoo",
    avatar: "https://avatars.githubusercontent.com/u/39014834?s=32&v=4",
    status: "Invisible",
    id: "dv98h",
  },

  {
    username: "shark",
    avatar: "https://avatars.githubusercontent.com/u/95330865?s=32&v=4",
    status: "Online",
    id: "9823rh",
  },

  {
    username: "Web Dev Simplified",
    avatar: "https://avatars.githubusercontent.com/u/39717099?s=32&v=4",
    status: "Idle",
    id: "43298h",
  },
  {
    username: "Some Meticulously Epic Person !!",
    avatar: "https://avatars.githubusercontent.com/u/51186394",
    status: "Invisible",
    id: "98hn",
  },
];

export default function PrivateChannels() {
  const [showTooltip, setShowTooltip] = useState("");

  return (
    <nav
      className="bg-background-secondary overflow-auto pb-2 grow"
      aria-label="Private channels"
    >
      <div className="flex justify-center h-12 items-center px-2.5 shadow-elevation-low sticky top-0 bg-background-secondary">
        <button className="h-7 bg-background-tertiary rounded-sm text-sm px-1.5 py-[1px] font-medium text-channels-default w-full text-left truncate">
          Find or start a conversation
        </button>
      </div>
      <ul aria-label="Direct Messages" className="mt-2">
        <li className="cursor-pointer flex mx-2 bg-background-modifier-selected h-11 rounded-[4px] my-[1px] hover:bg-background-interactive-hover hover:text-interactive-hover font-medium">
          <Link href="/" className="flex gap-2">
            <div className="flex items-center px-2">
              <div className="mr-3">
                <Friend />
              </div>
              <p>Friends</p>
            </div>
          </Link>
        </li>
        <li
          className={cn(
            "cursor-pointer flex mx-2 h-11 rounded-[4px] text-channels-default hover:bg-background-interactive-hover my-[1px] hover:text-interactive-hover font-medium",
            {
              "text-white": false,
              "bg-background-modifier-selected": false,
            }
          )}
        >
          <Link href="/" className="flex gap-2">
            <div className="flex items-center px-2">
              <div className="mr-3">
                <Nitro />
              </div>
              <p>Nitro</p>
            </div>
          </Link>
        </li>
        <li
          className={cn(
            "cursor-pointer flex mx-2 h-11 rounded-[4px] text-channels-default hover:bg-background-interactive-hover my-[1px] hover:text-interactive-hover font-medium",
            {
              "text-white": false,
              "bg-background-modifier-selected": false,
            }
          )}
        >
          <Link href="/" className="flex gap-2">
            <div className="flex items-center px-2">
              <div className="mr-3">
                <Shop />
              </div>
              <p>Shop</p>
            </div>
          </Link>
        </li>
        <h2 className="text-xs pt-[18px] pr-2 pb-1 pl-[18px] font-semibold leading-3 text-channels-default tracking-[.02em]  flex items-center h-10 truncate hover:text-interactive-hover">
          <span className="grow uppercase">Direct Messages</span>

          <ActionTooltip content="Create DM">
            <button className="w-4 mr-1">
              <DMPlus />
            </button>
          </ActionTooltip>
        </h2>
        {dms.map((dm, idx) => {
          let selected = false;
          if (idx === 0) selected = true;
          return (
            <li
              className={cn(
                "flex cursor-pointer mx-2 my-[1px] rounded-[4px] h-11 hover:text-interactive-hover hover:bg-background-interactive-hover group text-channels-default",
                {
                  "bg-background-modifier-selected": selected,
                }
              )}
              key={dm.id}
            >
              <Link
                href={`/channels/${dm.id}`}
                className="flex items-center gap-3 px-2 overflow-hidden grow"
                onMouseOver={(e) => {
                  const el = e.target;
                  if (!(el && el instanceof HTMLElement)) {
                    return;
                  }
                  if (el.dataset.username !== "username") return;
                  const widthOverflow = el.offsetWidth < el.scrollWidth;
                  if (widthOverflow) setShowTooltip(dm.id);
                  else setShowTooltip("");
                }}
              >
                <div className="flex justify-center items-center shrink-0">
                  <div className="w-8 h-8">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      aria-hidden="true"
                    >
                      <foreignObject
                        x="0"
                        y="0"
                        width="32"
                        height="32"
                        mask="url(#svg-mask-avatar-status-round-32)"
                      >
                        <div>
                          <Image
                            src={dm.avatar}
                            alt={`${dm.username}, ${dm.status}`}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                      </foreignObject>
                      <rect
                        width="10"
                        height="10"
                        x="22"
                        y="22"
                        fill={STATUS[dm.status].color}
                        mask={STATUS[dm.status].mask}
                      ></rect>
                    </svg>
                  </div>
                </div>

                {showTooltip === dm.id ? (
                  <ActionTooltip content={dm.username}>
                    <div
                      className={cn("overflow-hidden", {
                        "text-white": selected,
                      })}
                    >
                      <p className="truncate" data-username="username">
                        {dm.username}
                      </p>
                    </div>
                  </ActionTooltip>
                ) : (
                  <div
                    className={cn("overflow-hidden", {
                      "text-white": selected,
                    })}
                  >
                    <p className="truncate" data-username="username">
                      {dm.username}
                    </p>
                  </div>
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
        })}
      </ul>
    </nav>
  );
}
