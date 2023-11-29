"use client";

import { Message, More } from "../svgs";
import { useRouter } from "next/navigation";
import { FriendTab } from "@/types/friend-tab";
import { SocialPopulated } from "@/types/social";
import AvatarMask from "../avatar/AvatarMask";
import { getSocialType } from "@/utils/helpers/getSocialType";
import ActionButton from "../tooltip/ActionButton";

type FriendsListProps = {
  social: SocialPopulated["social"];
  tab: FriendTab;
};

export default function FriendsList({ tab, social }: FriendsListProps) {
  const router = useRouter();

  const socialType = getSocialType(tab, social);

  return (
    <div className="overflow-hidden">
      <h2 className="mt-4 mr-5 mb-2 ml-[30px] text-xs uppercase text-header-primary truncate tracking-[0.02em]">
        {tab === "All" ? "All Friends" : tab} — {socialType.length}
      </h2>

      <ul className="flex flex-col mt-2 pb-2 pr-2 overflow-auto">
        {socialType.map((friend) => {
          return (
            <li
              className="flex justify-between ml-[30px] mr-5 border-t-[1px] border-background-modifier-accent hover:bg-background-interactive-hover rounded-md cursor-pointer h-[62px] px-2 grow group"
              key={friend.id}
              onClick={() => router.push(`/channels/${friend.id}`)}
              tabIndex={0}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-2">
                    <AvatarMask
                      username={friend.username}
                      status={friend.status}
                      avatar={friend.avatar}
                    />
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
