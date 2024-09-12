import { FriendTab } from "@/types/friend-tab";
import { PendingStatus, SocialPopulated, SocialUser } from "@/types/social";

type SocialTypeReturn = {
  type: "Online" | "All" | "Pending" | "Blocked" | "unknown";
  targetSocial: SocialUser[] | PendingStatus[];
};

export const getSocialType = (
  tab: FriendTab,
  social: SocialPopulated["social"]
): SocialTypeReturn => {
  switch (tab) {
    case "Online":
      const onlineFriends = social.friends.filter(
        (friend) =>
          friend.status.match(/Online|Idle|Do Not Disturb/) && friend.online
      );

      return { type: "Online", targetSocial: onlineFriends };

    case "All": {
      const sorted = [...social.friends].sort((a, b) => {
        const aOnline = a.online && a.status !== "Invisible";
        const bOnline = b.online && b.status !== "Invisible";
        return aOnline ? -1 : bOnline ? 1 : 0;
      });

      return { type: "All", targetSocial: sorted };
    }

    case "Pending":
      return { type: "Pending", targetSocial: social.pending };

    case "Blocked":
      return { type: "Blocked", targetSocial: social.blocked };

    default:
      console.log("No cases matched. Probably Add Friend tab.");
      return { type: "unknown", targetSocial: [] };
  }
};
