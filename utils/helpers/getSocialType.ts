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

    case "All":
      return { type: "All", targetSocial: social.friends };

    case "Pending":
      return { type: "Pending", targetSocial: social.pending };

    case "Blocked":
      return { type: "Blocked", targetSocial: social.blocked };

    default:
      console.log("No cases matched. Probably Add Friend tab.");
      return { type: "unknown", targetSocial: [] };
  }
};
