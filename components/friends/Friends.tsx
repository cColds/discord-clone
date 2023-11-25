"use client";

import { useState } from "react";
import FriendsBody from "./FriendsBody";
import FriendsTab from "./FriendsTab";
import { FriendTab } from "@/types/friend-tab";
import { SocialPopulated } from "@/types/social";

export default function Friends({ social }: SocialPopulated) {
  const [tab, setTab] = useState<FriendTab>("Online");

  const handleTabClick = (tabType: FriendTab) => setTab(tabType);

  return (
    <div
      className="bg-background-primary grow flex flex-col"
      aria-label="Friends"
    >
      <FriendsTab onTabClick={handleTabClick} tab={tab} />

      <FriendsBody social={social} tab={tab} />
    </div>
  );
}
