import { SocialPopulated } from "@/types/social";
import { FriendTab } from "@/types/friend-tab";
import FriendsList from "./FriendsList";
import FriendsListSearchBar from "../search/FriendsListSearchBar";
import AddFriend from "./AddFriend";

type FriendsBodyProps = {
  social: SocialPopulated["social"];
  tab: FriendTab;
};

export default function FriendsBody({ social, tab }: FriendsBodyProps) {
  return (
    <div className="flex grow">
      {/* Should add the rest of the tab components at some point */}

      {tab === "Add Friend" ? (
        <AddFriend />
      ) : (
        <div className="flex flex-col grow">
          <FriendsListSearchBar />
          <FriendsList tab={tab} social={social} />
        </div>
      )}

      <aside className="min-w-[360px] max-w-[420px] basis-[30%] p-4 border-l-[1px] border-background-modifier-accent xl:block hidden">
        Activity Bar
      </aside>
    </div>
  );
}
