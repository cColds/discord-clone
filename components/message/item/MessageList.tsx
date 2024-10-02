"use client";

import { MessageType } from "@/types/message";
import { differenceInMinutes, format, isSameDay } from "date-fns";
import MessageItem from "./MessageItem";
import { UserType } from "@/types/user";
import { useState } from "react";
import MessagePreviewList from "./MessagePreviewList";
import { formatMessageDate } from "@/utils/helpers/formatMessageDate";

type MessageListProps = { messages: MessageType[]; user: UserType };

const MessageList = ({ messages, user }: MessageListProps) => {
  const [editMessageId, setEditMessageId] = useState<string | null>(null);

  const handleEditMessageId = (messageId: string | null) => {
    setEditMessageId(messageId);
  };

  return (
    <>
      {messages.map((msg, index) => {
        const formatted = formatMessageDate(new Date(msg.createdAt));

        const editedDate = format(
          msg.edited || msg.updatedAt,
          "EEEE, LLLL d h:mm a"
        );

        const prevMsg = index > 0 ? messages[index - 1] : null;

        const sameDay =
          !!prevMsg && isSameDay(msg.createdAt, prevMsg.createdAt);
        const isWithinTimeRange =
          sameDay && differenceInMinutes(msg.createdAt, prevMsg.createdAt) <= 7;

        const shouldMergeMessages =
          isWithinTimeRange &&
          msg.sender._id === prevMsg.sender._id &&
          msg.type === "user" &&
          prevMsg.type === "user";

        const isEditActive = editMessageId === msg._id;
        const isYourMessage = user.id === msg.sender.id;

        return (
          <MessageItem
            msg={msg}
            editedDate={editedDate}
            showDateDivider={!prevMsg || !sameDay}
            shouldMergeMessages={shouldMergeMessages}
            formatted={formatted}
            key={msg._id}
            isEditActive={isEditActive}
            onEditToggle={handleEditMessageId}
            editMessageId={editMessageId}
            isYourMessage={isYourMessage}
            prevMessage={prevMsg}
          />
        );
      })}

      <MessagePreviewList
        user={user}
        prevMessage={messages[messages.length - 1]}
      />
    </>
  );
};

export default MessageList;
