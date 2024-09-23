"use client";

import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import DmHeader from "./DmHeader";
import DmNewChatHeader from "./DmNewChatHeader";
import DmMainChat from "./DmMainChat";
import MessageBox from "../message/input/MessageBox";
import { useEffect, useRef, useState } from "react";
import DmSidebar from "./DmSidebar";
import { FetchNextPageType } from "@/types/tanstack-query";
import { useMutationState } from "@tanstack/react-query";
import { MessageMutation } from "@/types/MessageMutation";

type DmChannelType = {
  user: UserType;
  recipient: UserType;
  messages: MessageType[];
  fetchNextPage: FetchNextPageType;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function DmChannel({
  user,
  recipient,
  messages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: DmChannelType) {
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const messagesMutation = useMutationState({
    filters: { mutationKey: ["messages"], status: "pending" },
    select: (mutation) => mutation.state as MessageMutation,
  });

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;

      setIsReadyToShow(true);
    }
  }, []);

  useEffect(() => {
    if (messagesMutation.length > 0 && scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messagesMutation]);

  const toggleSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex grow overflow-hidden flex-col bg-background-primary">
      <DmHeader
        recipient={recipient}
        sidebarOpen={sidebarOpen}
        toggleSidebarOpen={toggleSidebarOpen}
      />
      <div className="flex overflow-hidden grow">
        <div
          className="flex flex-col grow overflow-hidden"
          aria-label="(channel)"
        >
          <div className="scroller grow flex flex-col justify-end h-full">
            <div
              className="overflow-y-scroll overflow-x-hidden grow"
              ref={scrollerRef}
              style={{ visibility: isReadyToShow ? "visible" : "hidden" }}
            >
              <div className="flex flex-col min-h-full items-stretch justify-end">
                <DmNewChatHeader user={user} recipient={recipient} />
                <DmMainChat
                  messages={messages}
                  scrollerRef={scrollerRef}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </div>
            </div>
            <MessageBox sender={user} recipient={recipient} type="dm" />
          </div>
        </div>

        {sidebarOpen && <DmSidebar recipient={recipient} />}
      </div>
    </div>
  );
}
