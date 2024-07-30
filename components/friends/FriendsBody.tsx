import { SocialPopulated } from "@/types/social";
import { FriendTab } from "@/types/friend-tab";
import FriendsList from "./FriendsList";
import AddFriend from "./AddFriend";

type FriendsBodyProps = {
  social: SocialPopulated["social"];
  tab: FriendTab;
  userId: string;
  onTabClick: (tabType: FriendTab) => void;
};

export default function FriendsBody({
  social,
  tab,
  userId,
  onTabClick,
}: FriendsBodyProps) {
  return (
    <div className="flex grow">
      {tab === "Add Friend" ? (
        <AddFriend />
      ) : (
        <FriendsList
          tab={tab}
          social={social}
          onTabClick={onTabClick}
          userId={userId}
        />
      )}

      <aside className="min-w-[360px] max-w-[420px] basis-[30%] p-4 border-l-[1px] border-background-modifier-accent xl:block hidden">
        <h2 className="font-extrabold mt-2 mb-4 text-xl text-header-primary">
          Active Now
        </h2>

        <div className="flex p-4 justify-center items-center flex-col rounded-lg text-center">
          <h2 className="mb-1 text-header-primary font-bold">
            It&apos;s quiet for now...
          </h2>
          <p className="text-sm text-interactive-normal">
            When a friend starts an activity—like playing a game or hanging out
            on voice—we’ll show it here!
          </p>
        </div>
      </aside>
    </div>
  );
}
