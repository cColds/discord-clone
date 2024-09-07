import React from "react";
import { UserDms } from "@/types/user";
import UserLinkIcon from "./UserLinkIcon";
import { UnreadCount } from "@/types/UnreadCount";
import { FramerMotionOptions } from "@/types/FramerMotionOptions";

interface UnreadDMsProps {
  unreadCounts: UnreadCount[];
  channels: UserDms["dms"];
  onHoveredServer: (serverId: string) => void;
  options: FramerMotionOptions;
}

const UnreadDMs: React.FC<UnreadDMsProps> = ({
  unreadCounts,
  channels,
  onHoveredServer,
  options,
}) => {
  const sortedChannels = [...channels].sort((a, b) => {
    const aIndex = unreadCounts.findIndex((u) => u.channelId === a.channel._id);
    const bIndex = unreadCounts.findIndex((u) => u.channelId === b.channel._id);

    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });

  return (
    <>
      {sortedChannels.map((channel) => {
        const channelId = channel.channel._id;

        const count =
          unreadCounts.find((u) => u.channelId === channelId)?.count || 0;

        if (count === 0) return;

        return (
          <UserLinkIcon
            key={channelId}
            url={channel.recipient.avatar}
            channelId={channelId}
            notifications={count}
            displayName={channel.recipient.displayName}
            onHoveredServer={onHoveredServer}
            options={options}
          />
        );
      })}
    </>
  );
};

export default UnreadDMs;
