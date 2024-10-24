"use client";

import { Member, TextOrVoiceChannel } from "@/types/server";
import ChannelHeader from "./ChannelHeader";
import ChannelMainChat from "./ChannelMainChat";
import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import MessageBox from "../message/input/MessageBox";
import ChannelMembersList from "./ChannelMembersList";
import { useState } from "react";
import { FetchNextPageType } from "@/types/tanstack-query";

type ChannelProps = {
  channel: TextOrVoiceChannel;
  user: UserType;
  messages: MessageType[];
  members: Member[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: FetchNextPageType;
  ownerId: string;
};

const Channel = ({
  channel,
  user,
  messages,
  members,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  ownerId,
}: ChannelProps) => {
  const [membersListOpen, setMembersListOpen] = useState(false);

  const toggleMembersList = () => setMembersListOpen(!membersListOpen);

  return (
    <div className="flex flex-col overflow-hidden bg-background-primary flex-grow h-full scroller">
      <ChannelHeader
        channelName={channel.name}
        onMembersListToggle={toggleMembersList}
        membersListOpen={membersListOpen}
      />

      <div className="flex flex-col grow overflow-hidden">
        <div className="flex grow min-h-full">
          <div className="flex flex-col min-w-0 grow">
            <ChannelMainChat
              channel={channel}
              user={user}
              messages={messages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              ownerId={ownerId}
            />
            <MessageBox
              sender={user}
              channelName={channel.name}
              type="server"
            />
          </div>
          <ChannelMembersList
            members={members}
            membersListOpen={membersListOpen}
            ownerId={ownerId}
          />
        </div>
      </div>
    </div>
  );
};

export default Channel;
