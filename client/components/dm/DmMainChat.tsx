"use client";

import { MessageType } from "@/types/message";
import MessageItem from "./MessageItem";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";
import {
  differenceInMinutes,
  format,
  formatRelative,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns";

export default function DmMainChat({ messages }: { messages: MessageType[] }) {
  const { user } = useUser();
  if (!user) redirect("/");

  let prevMessage: null | MessageType = null;

  return (
    <ol className="mb-[30px] min-h-[150px] overflow-hidden">
      {messages.map((msg) => {
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

        if (!prevMessage) {
          showDateDivider = true;
        } else {
          const sameDay = isSameDay(msg.createdAt, prevMessage.createdAt);

          shouldMergeMessages =
            differenceInMinutes(msg.createdAt, prevMessage.createdAt) <= 7 &&
            msg.sender._id === prevMessage.sender._id &&
            sameDay;

          showDateDivider = !sameDay;
        }

        prevMessage = msg;

        return (
          <MessageItem
            msg={msg}
            user={user}
            editedDate={editedDate}
            showDateDivider={showDateDivider}
            shouldMergeMessages={shouldMergeMessages}
            formatted={formatted}
            key={msg._id}
          />
        );
      })}
    </ol>
  );
}
