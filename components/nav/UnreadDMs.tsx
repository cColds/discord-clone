import React from "react";
import { UserDms } from "@/types/user";
import UserLinkIcon from "./UserLinkIcon";

interface UnreadDMsProps {
  unreadCounts: Record<string, number>;
  channels: UserDms["dms"];
}

const UnreadDMs: React.FC<UnreadDMsProps> = ({ unreadCounts, channels }) => {
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
