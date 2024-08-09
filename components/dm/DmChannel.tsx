"use client";

import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import DmHeader from "./DmHeader";
import DmNewChatHeader from "./DmNewChatHeader";
import DmMainChat from "./DmMainChat";
import MessageBox from "../message/input/MessageBox";
import { useEffect, useRef, useState } from "react";

type DmChannelType = {
  user: UserType;
  recipient: UserType;
  messages: MessageType[];
  addOptimisticMessage: (msg: MessageType) => void;
};

export default function DmChannel({
  user,
  recipient,
  messages,
  addOptimisticMessage,
}: DmChannelType) {
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(
    messages.length > 0 ? messages[messages.length - 1]._id : null
  );

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;

      setIsReadyToShow(true);
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setLastMessageId(null);
      return;
    }

    const latestMessage = messages[messages.length - 1];
    if (lastMessageId !== latestMessage._id) {
      if (scrollerRef.current) {
        scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
      }
      setLastMessageId(latestMessage._id);
    }
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

        <MessageBox
          sender={user}
          recipient={recipient}
          type="dm"
          addOptimisticMessage={addOptimisticMessage}
        />
      </div>
    </div>
  );
}
