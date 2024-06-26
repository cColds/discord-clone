"use client";

import { format } from "date-fns";
import Image from "next/image";
import ActionTooltip from "@/components/tooltip/ActionTooltip";
import EditMessageBox from "@/components/EditMessageBox";
import MessageActions from "@/components/tooltip/MessageActions";
import { MessageType } from "@/types/message";
import DateDivider from "@/components/DateDivider";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/user";
import { useState } from "react";
import { editMessage } from "@/lib/db/editMessage";
import { useSocket } from "@/app/providers/SocketProvider";
import { useParams } from "next/navigation";

type MessageItemType = {
  msg: MessageType;
  user: UserType;
  editedDate: string;
  showDateDivider: boolean;
  shouldMergeMessages: boolean;
  formatted: string;
};

export default function MessageItem({
  msg,
  user,
  editedDate,
  showDateDivider,
  shouldMergeMessages,
  formatted,
}: MessageItemType) {
  const [editMessageId, setEditMessageId] = useState<null | string>(null);
  const [editedMessage, setEditedMessage] = useState<null | string>(null);

  const { socket } = useSocket();
  const { channelId } = useParams();

  const handleEditMessage = (messageId: string | null) => {
    setEditMessageId(messageId);
    setEditedMessage(null);
  };

  const updateEditedMessage = (message: string) => setEditedMessage(message);

  const saveMessageChange = async () => {
    if (!editedMessage || !editMessageId) {
      throw new Error("Message id cannot be null");
    }

    try {
      await editMessage(editMessageId, editedMessage);
      socket.emit("send-message", channelId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
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
          <div className="text-text-normal overflow-hidden leading-[1.375rem]">
            <span>{msg.message}</span>
            {msg.edited && (
              <ActionTooltip content={editedDate}>
                <span className="text-xs text-text-muted leading-[1.375rem] select-none">
                  <time
                    aria-label={formatted}
                    dateTime={msg.edited.toString() || msg.updatedAt}
                  >
                    <span> (edited)</span>
                  </time>
                </span>
              </ActionTooltip>
            )}
          </div>
          {editMessageId === msg._id && (
            <EditMessageBox
              message={msg.message}
              onEditMessage={handleEditMessage}
              saveMessageChange={saveMessageChange}
              updateEditedMessage={updateEditedMessage}
              editedMessage={editedMessage}
            />
          )}
          {editMessageId !== msg._id && (
            <MessageActions
              isYourMessage={user.id === msg.sender._id}
              onEditMessage={handleEditMessage}
              messageId={msg._id}
            />
          )}
        </div>
      </li>
    </>
  );
}
