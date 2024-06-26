"use client";

import { useState } from "react";
import FriendsBody from "./FriendsBody";
import FriendsTab from "./FriendsTab";
import { FriendTab } from "@/types/friend-tab";
import { SocialPopulated } from "@/types/social";

export default function Friends({
  social,
  userId,
}: SocialPopulated & { userId: string }) {
  const [tab, setTab] = useState<FriendTab>("Online");

  const handleTabClick = (tabType: FriendTab) => setTab(tabType);
  const pendingRequests = social.pending.filter(
    (pending) => pending.request === "Incoming"
  ).length;

  return (
    <div
      className="bg-background-primary grow flex flex-col overflow-hidden"
      aria-label="Friends"
    >
      <FriendsTab
        onTabClick={handleTabClick}
        tab={tab}
        pendingRequests={pendingRequests}
      />

      <FriendsBody
        social={social}
        tab={tab}
        onTabClick={handleTabClick}
        userId={userId}
      />
    </div>
  );
}
