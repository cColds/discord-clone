import { FriendTab } from "@/types/friend-tab";
import { SocialPopulated } from "@/types/social";

export const getSocialType = (
  tab: FriendTab,
  social: SocialPopulated["social"]
) => {
  switch (tab) {
    case "Online":
      const onlineFriends = social.friends.filter((friend) =>
        friend.status.match(/Online|Idle|Do Not Disturb/)
      );

      return onlineFriends;

    case "All":
      return social.friends;

    case "Pending":
      return social.pending;

    case "Blocked":
      return social.blocked;

    // I have a condition that doesn't render this component if the tab is 'Add Friend'
    // but I don't know how to tell TypeScript.
    default:
      console.log("No cases matched. Probably Add Friend tab.");
      return [];
  }
};
