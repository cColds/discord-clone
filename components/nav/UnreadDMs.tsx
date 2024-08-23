import React, { useEffect, useState } from "react";
import { UserDms } from "@/types/user";
import { getUnreadMessages } from "@/lib/db/getUnreadMessages";
import UserLinkIcon from "./UserLinkIcon";

interface UnreadDMsProps {
  userId: string;
  channels: UserDms["dms"];
}

const UnreadDMs: React.FC<UnreadDMsProps> = ({ userId, channels }) => {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        console.log("Running with userId:", userId);
        const results = await getUnreadMessages(userId);
        console.log("Query results:", results);

        const counts = results.reduce<Record<string, number>>((acc, item) => {
          acc[item.channelId] = item.unreadCount;
          return acc;
        }, {});

        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error fetching unread message counts:", error);
      }
    };

    fetchUnreadCounts();
  }, [userId, channels]);

  return (
    <>
      {channels.map((channel) => {
        const channelId = channel.channel._id;

        const count = unreadCounts[channelId] || 0;

        if (count === 0) return;

        return (
          <UserLinkIcon
            key={channelId}
            url={channel.recipient.avatar}
            channelId={channelId}
            notifications={count}
            displayName={channel.recipient.displayName}
          />
        );
      })}
    </>
  );
};

export default UnreadDMs;
