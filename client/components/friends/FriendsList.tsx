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
  onTabClick: (tabType: FriendTab) => void;
};

function showWumpusBackground(
  tab: FriendTab,
  onTabClick: (tabType: FriendTab) => void
) {
  return (
    <div className="flex justify-center items-center grow">
      <div className="flex flex-col justify-center items-center">
        {tab === "Online" && (
          <>
            <div className="bg-wumpus-none-online w-[421px] h-[218px] mb-10" />
            <p className="text-text-muted text-center mt-2">
              No one's around to play with Wumpus
            </p>
          </>
        )}

        {tab === "All" && (
          <div className="flex justify-center items-center flex-col">
            <div className="bg-wumpus-waiting-friends w-[376px] h-[162px] mb-10" />

            <p className="text-text-muted text-center mt-2">
              Wumpus is waiting on friends. You don&apos;t have to though!
            </p>
            <button
              onClick={() => onTabClick("Add Friend")}
              className="bg-brand-500 mt-5 h-[38px] min-w-[96px] min-h-[38px] transition-colors ease-linear duration-150 hover:bg-brand-560 text-sm rounded-[3px] px-0.5 py-4 flex justify-center items-center font-medium"
            >
              Add Friend
            </button>
          </div>
        )}

        {tab === "Pending" && (
          <>
            <div className="bg-wumpus-pending-request w-[415px] h-[200px] mb-10" />
            <p className="text-text-muted text-center mt-2">
              There are no pending friend requests. Here's Wumpus for now.
            </p>
          </>
        )}

        {tab === "Blocked" && (
          <>
            <div className="bg-wumpus-cant-unblock w-[433px] h-[232px] mb-10" />
            <p className="text-text-muted text-center mt-2">
              You can't unblock the Wumpus.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function FriendsList({
  tab,
  social,
  onTabClick,
}: FriendsListProps) {
  const router = useRouter();

  const socialType = getSocialType(tab, social);

  return (
    <div className="flex flex-col grow">
      {socialType.length === 0 ? (
        showWumpusBackground(tab, onTabClick)
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
                const friendStatus = friendData.online
                  ? friendData.status
                  : "Offline";

                return (
                  <li
                    className="flex justify-between ml-[30px] mr-5 border-t-[1px] border-background-modifier-accent hover:bg-background-interactive-hover rounded-md cursor-pointer h-[62px] px-2 grow group"
                    key={friendData.id}
                    onClick={() =>
                      router.push(`/channels/dms/${friendData.id}`)
                    }
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-center w-full group">
                      <div className="flex items-center">
                        <div className="w-8 h-8 mr-2">
                          <AvatarMask
                            username={friendData.username}
                            status={friendStatus}
                            avatar={friendData.avatar}
                            removeMask={isPendingStatus}
                          />
                        </div>
                        <div className="py-1 mr-1 overflow-hidden">
                          <div className="flex items-center">
                            <p className="text-header-primary text-left truncate font-bold">
                              {friendData.displayName}
                            </p>

                            <p className="truncate ml-[5px] text-header-secondary text-sm invisible group-hover:visible font-medium">
                              {friendData.username}
                            </p>
                          </div>
                          <div className="text-left text-sm text-header-secondary">
                            {isPendingStatus && (
                              <p className="truncate text-xs">
                                {friend.request} Friend Request
                              </p>
                            )}

                            {!isPendingStatus && (
                              <p className="truncate">{friendStatus}</p>
                            )}
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
