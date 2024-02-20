"use client";

import { useRouter } from "next/navigation";
import { FriendTab } from "@/types/friend-tab";
import { SocialPopulated } from "@/types/social";
import AvatarMask from "../avatar/AvatarMask";
import { getSocialType } from "@/utils/helpers/getSocialType";
import FriendActions from "./action-buttons/FriendActions";
import PendingActions from "./action-buttons/PendingActions";
import BlockedActions from "./action-buttons/BlockedActions";
import FriendsListSearchBar from "../search/FriendsListSearchBar";

type FriendsListProps = {
  social: SocialPopulated["social"];
  tab: FriendTab; // TODO: i think i somehow added invisible and offline status to the friend tab
};

function showWumpusBackground(tab: FriendTab) {
  return (
    <div className="flex justify-center items-center grow">
      <div className="flex flex-col justify-center items-center">
        {tab === "Pending" && (
          <>
            <div className="bg-wumpus-pending-request w-[415px] h-[200px] mb-10" />
            <p className="text-text-muted text-center mt-2">
              There are no pending friend requests. Here's Wumpus for now.
            </p>
          </>
        )}

        {tab === "Online" && (
          <>
            <div className="bg-wumpus-none-online w-[421px] h-[218px] mb-10" />
            <p className="text-text-muted text-center mt-2">
              No one's around to play with Wumpus
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function FriendsList({ tab, social }: FriendsListProps) {
  const router = useRouter();

  const socialType = getSocialType(tab, social);

  return (
    <div className="flex flex-col grow">
      {socialType.length === 0 ? (
        showWumpusBackground(tab)
      ) : (
        <>
          <FriendsListSearchBar />
          <div className="overflow-hidden">
            <h2 className="mt-4 mr-5 mb-2 ml-[30px] text-xs uppercase text-header-primary truncate tracking-[0.02em]">
              {tab === "All" ? "All Friends" : tab} — {socialType.length}
            </h2>

            <ul className="flex flex-col mt-2 pb-2 pr-2 overflow-auto">
              {socialType.map((friend) => {
                const isPendingStatus = "user" in friend;
                const friendData = isPendingStatus ? friend.user : friend;

                return (
                  <li
                    className="flex justify-between ml-[30px] mr-5 border-t-[1px] border-background-modifier-accent hover:bg-background-interactive-hover rounded-md cursor-pointer h-[62px] px-2 grow group"
                    key={friendData.id}
                    onClick={() =>
                      router.push(`/channels/dms/${friendData.id}`)
                    }
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <div className="w-8 h-8 mr-2">
                          <AvatarMask
                            username={friendData.username}
                            status={friendData.status}
                            avatar={friendData.avatar}
                          />
                        </div>
                        <div className="py-1 mr-1 overflow-hidden">
                          <div>
                            <p className="text-left truncate font-bold">
                              {friendData.username}
                            </p>
                          </div>
                          <div className="text-left text-sm text-header-secondary">
                            <p className="truncate">{friendData.status}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex ml-2 gap-2">
                        {(tab === "Online" || tab === "All") && (
                          <FriendActions recipientId={friendData.id} />
                        )}

                        {isPendingStatus && tab === "Pending" && (
                          // TODO: use dynamic type value when schema and types updated
                          <PendingActions
                            type={friend.request}
                            recipientId={friendData.id}
                          />
                        )}

                        {tab === "Blocked" && (
                          <BlockedActions recipientId={friendData.id} />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
