"use client";

import { MessageType } from "@/types/message";
import {
  differenceInMinutes,
  format,
  formatRelative,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns";
import MessageItem from "./MessageItem";
import { UserType } from "@/types/user";
import { useState } from "react";
import MessagePreviewList from "./MessagePreviewList";

type MessageListProps = {
  messages: MessageType[];
  user: UserType;
};

const MessageList = ({ messages, user }: MessageListProps) => {
  const [editMessageId, setEditMessageId] = useState<string | null>(null);

  const handleEditMessageId = (messageId: string | null) => {
    setEditMessageId(messageId);
  };

  return (
    <>
      {messages.map((msg, index) => {
        const formattedDate = format(msg.createdAt, "MM/dd/yyyy h:mm a");
        const formattedRelative = formatRelative(msg.createdAt, new Date());

        const isTodayOrYesterday =
          isToday(msg.createdAt) || isYesterday(msg.createdAt);

        const formatted = isTodayOrYesterday
          ? formattedRelative.charAt(0).toUpperCase() +
            formattedRelative.slice(1)
          : formattedDate;

        const editedDate = format(
          msg.edited || msg.updatedAt,
          "EEEE, LLLL d h:mm a"
        );

        let showDateDivider = false;
        let shouldMergeMessages = false;

        const prevMessage = index > 0 ? messages[index - 1] : null;

        if (!prevMessage) {
          showDateDivider = true;
        } else {
          const sameDay = isSameDay(msg.createdAt, prevMessage.createdAt);

          shouldMergeMessages =
            differenceInMinutes(msg.createdAt, prevMessage.createdAt) <= 7 &&
            msg.sender._id === prevMessage.sender._id &&
            sameDay &&
            msg.type === "user" &&
            prevMessage.type !== "system";

          showDateDivider = !sameDay;
        }

        const isEditActive = editMessageId === msg._id;
        const isYourMessage = user.id === msg.sender.id;

        return (
          <MessageItem
            msg={msg}
            editedDate={editedDate}
            showDateDivider={showDateDivider}
            shouldMergeMessages={shouldMergeMessages}
            formatted={formatted}
            key={msg._id}
            isEditActive={isEditActive}
            onEditToggle={handleEditMessageId}
            editMessageId={editMessageId}
            isYourMessage={isYourMessage}
            prevMessage={prevMessage}
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
