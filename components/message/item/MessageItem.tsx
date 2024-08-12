"use client";

import EditMessageBox from "@/components/message/input/EditMessageBox";
import MessageActions from "@/components/tooltip/MessageActions";
import DateDivider from "@/components/message/item/DateDivider";
import { MessageType } from "@/types/message";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/user";
import { useState } from "react";
import { editMessage } from "@/lib/db/editMessage";
import { useSocket } from "@/app/providers/SocketProvider";
import { useParams } from "next/navigation";
import ImageList from "./ImageList";
import MessageDetails from "./MessageDetails";
import ProcessingImage from "./ProcessingImage";

type MessageItemType = {
  msg: MessageType & { pending?: boolean };
  user: UserType;
  editedDate: string;
  showDateDivider: boolean;
  shouldMergeMessages: boolean;
  formatted: string;
  isEditActive: boolean;
  onEditToggle: (id: string | null) => void;
  editMessageId: string | null;
};

export default function MessageItem({
  msg,
  user,
  editedDate,
  showDateDivider,
  shouldMergeMessages,
  formatted,
  isEditActive,
  onEditToggle,
  editMessageId,
}: MessageItemType) {
  const [editedMessage, setEditedMessage] = useState<null | string>(null);

  const { socket } = useSocket();
  const { channelId } = useParams();

  const handleEditMessage = (messageId: string | null) => {
    onEditToggle(messageId);
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

  if (msg.pending && msg.images.length) {
    return <ProcessingImage />;
  }

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
              "bg-background-message-hover": isEditActive,
            }
          )}
        >
          <MessageDetails
            msg={msg}
            shouldMergeMessages={shouldMergeMessages}
            formatted={formatted}
            editedDate={editedDate}
            isEditActive={isEditActive}
          />

          {!isEditActive && <ImageList images={msg.images} />}

          {isEditActive && (
            <EditMessageBox
              message={msg.message}
              onEditMessage={handleEditMessage}
              saveMessageChange={saveMessageChange}
              updateEditedMessage={updateEditedMessage}
              editedMessage={editedMessage}
            />
          )}
          {!isEditActive && (
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