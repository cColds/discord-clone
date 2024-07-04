"use client";

import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import DmHeader from "./DmHeader";
import DmNewChatHeader from "./DmNewChatHeader";
import DmMainChat from "./DmMainChat";
import DmMessageBox from "./DmMessageBox";
import { useEffect, useRef, useState } from "react";

type DmChannelType = {
  user: UserType;
  recipient: UserType;
  messages: MessageType[];
};

export default function DmChannel({
  user,
  recipient,
  messages,
}: DmChannelType) {
  const [isReadyToShow, setIsReadyToShow] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;

      setIsReadyToShow(true);
    }
    // probably should only scroll for the first time and remove messages dep
    //and scroll after messaging with sockets so editing doesn't scroll (maybe make another socket event for editing msg instead of send msg)
    // possibly only auto scroll msgs u send unless ur at the bottom then u can auto scroll friend
  }, [messages]);

  return (
    <div
      className="flex flex-col bg-background-primary grow"
      aria-label="(channel)"
    >
      <div className="scroller grow flex flex-col justify-end h-full">
        <DmHeader recipient={recipient} />

        <div
          className="overflow-y-scroll overflow-x-hidden grow"
          ref={scrollerRef}
          style={{ visibility: isReadyToShow ? "visible" : "hidden" }}
        >
          <div className="flex flex-col min-h-full items-stretch justify-end">
            <DmNewChatHeader user={user} recipient={recipient} />
            <DmMainChat messages={messages} />
          </div>
        </div>

        <DmMessageBox sender={user} recipient={recipient} type="dm" />
      </div>
    </div>
  );
}
