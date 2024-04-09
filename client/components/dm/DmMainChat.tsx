"use client";

import { MessageType } from "@/types/message";
import Image from "next/image";
import {
  differenceInMinutes,
  format,
  formatRelative,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns";
import React from "react";
import DateDivider from "@/components/DateDivider";
import { cn } from "@/lib/utils";

export default function DmMainChat({ messages }: { messages: MessageType[] }) {
  let prevMessage: null | MessageType = null;

  return (
    <ol className="mb-[30px] min-h-[150px]">
      {messages.map((msg) => {
        const formattedDate = format(msg.createdAt, "MM/dd/yyyy h:mm a");
        const formattedRelative = formatRelative(msg.createdAt, new Date());

        const isTodayOrYesterday =
          isToday(msg.createdAt) || isYesterday(msg.createdAt);

        const formatted = isTodayOrYesterday
          ? formattedRelative.charAt(0).toUpperCase() +
            formattedRelative.slice(1)
          : formattedDate;

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
          <React.Fragment key={msg._id}>
            {showDateDivider && <DateDivider date={msg.createdAt} />}

            <li className="relative">
              <div
                className={cn(
                  "min-h-[2.75rem] mt-[1.0625rem] py-0.5 pl-[72px] pr-[48px] hover:bg-background-message-hover group",
                  {
                    "m-0": shouldMergeMessages,
                    "min-h-[1.375rem]": shouldMergeMessages,
                  }
                )}
              >
                {!shouldMergeMessages ? (
                  <>
                    <Image
                      src={msg.sender.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full overflow-hidden cursor-pointer mt-0.5 select-none absolute left-4"
                    />
                    <h3 className="min-h-[1.375rem] leading-[1.375rem]">
                      <span className="leading-[1.375rem] text-header-primary overflow-hidden mr-[0.25rem] cursor-pointer hover:underline">
                        {msg.sender.displayName}
                      </span>
                      <time
                        dateTime={msg.createdAt}
                        className="text-xs leading-[1.375rem] text-text-muted ml-[0.25rem] overflow-hidden"
                      >
                        {formatted}
                      </time>
                    </h3>
                  </>
                ) : (
                  <span className="absolute left-0 w-[56px] text-[11px] leading-[1.375rem] select-none text-text-muted text-right opacity-0 group-hover:opacity-100">
                    <time aria-label={formatted} dateTime={msg.createdAt}>
                      {format(msg.createdAt, "h:mm a")}
                    </time>
                  </span>
                )}

                <div>
                  <span className="text-text-normal overflow-hidden">
                    {msg.message}
                  </span>
                </div>
              </div>
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}
