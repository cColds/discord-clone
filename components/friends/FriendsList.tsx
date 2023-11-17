"use client";

import Image from "next/image";
import ActionTooltip from "../tooltip/ActionTooltip";
import { Message, More } from "../svgs";
import { useRouter } from "next/navigation";

const onlineFriends = [
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r98sh",
  },
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r92348h",
  },
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r23198h",
  },
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r9sd8h",
  },
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r98ah",
  },
  {
    username: "cold",
    avatar: "https://avatars.githubusercontent.com/u/103373668?s=32&v=4",
    status: "Do Not Disturb",
    id: "r981h",
  },
];

export default function FriendsList() {
  const router = useRouter();

  return (
    <div className="overflow-hidden">
      <h2 className="mt-4 mr-5 mb-2 ml-[30px] text-xs uppercase text-header-primary truncate tracking-[0.02em]">
        Online — {onlineFriends.length}
      </h2>

      <ul className="flex flex-col mt-2 pb-2 pr-2 overflow-auto">
        {onlineFriends.map((friend) => {
          return (
            <li
              className="flex justify-between ml-[30px] mr-5 border-t-[1px] border-background-modifier-accent hover:bg-background-interactive-hover rounded-md cursor-pointer h-[62px] px-2 grow group"
              key={friend.id}
              onClick={() => router.push(`/channels/${friend.id}`)}
              tabIndex={0}
            >
              <div className="flex justify-between items-center w-full">
                {/* USER INFO */}

                <div className="flex items-center">
                  <div className="w-8 h-8 mr-2">
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
                        <Image
                          src={friend.avatar}
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
                      <p className="text-left truncate font-bold">
                        {friend.username}
                      </p>
                    </div>
                    <div className="text-left text-sm text-header-secondary">
                      <p className="truncate">{friend.status}</p>
                    </div>
                  </div>
                </div>

                {/* ICON ACTIONS */}
                <div className="flex ml-2 gap-2">
                  <ActionButton
                    name="Message"
                    onClick={() => router.push(`/channels/${friend.id}`)}
                  >
                    <Message />
                  </ActionButton>

                  <ActionButton
                    name="More"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <More />
                  </ActionButton>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type ActionButtonProps = {
  children: React.ReactNode;
  name: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButton = ({ children, name, ...props }: ActionButtonProps) => {
  return (
    <ActionTooltip content={name}>
      <button
        className="flex justify-center items-center text-interactive-normal hover:text-interactive-hover bg-background-secondary rounded-full w-9 h-9 group-hover:bg-background-tertiary"
        {...props}
      >
        {children}
      </button>
    </ActionTooltip>
  );
};
