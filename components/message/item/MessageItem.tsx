"use client";

import EditMessageBox from "@/components/message/input/EditMessageBox";
import MessageActions from "@/components/tooltip/MessageActions";
import DateDivider from "@/components/message/item/DateDivider";
import { MessageImage, MessageType } from "@/types/message";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSocket } from "@/app/providers/SocketProvider";
import { useParams } from "next/navigation";
import ImageList from "./ImageList";
import MessageDetails from "./MessageDetails";
import ProcessingImage from "./ProcessingImage";
import { useDeleteMessage, useEditMessage } from "@/lib/services/mutations";

type MessageItemType = {
  msg: MessageType & {
    pending?: boolean;
    previewImages?: FormDataEntryValue[];
  };
  editedDate: string;
  showDateDivider: boolean;
  shouldMergeMessages: boolean;
  formatted: string;
  isEditActive: boolean;
  onEditToggle: (id: string | null) => void;
  editMessageId: string | null;
  isYourMessage: boolean;
  prevMessage: MessageType | null;
};

export default function MessageItem({
  msg,
  editedDate,
  showDateDivider,
  shouldMergeMessages,
  formatted,
  isEditActive,
  onEditToggle,
  editMessageId,
  isYourMessage,
  prevMessage,
}: MessageItemType) {
  const [editedMessage, setEditedMessage] = useState<null | string>(null);

  const { socket } = useSocket();
  const { channelId } = useParams();
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();

  const toggleEditMessageBox = (messageId: string | null) => {
    onEditToggle(messageId);
    setEditedMessage(null);
  };

  const handleMessageChange = (message: string) => setEditedMessage(message);

  const handleEditMessage = async () => {
    if (!editedMessage || !editMessageId) {
      throw new Error("Message id cannot be null");
    }

    try {
      await editMessageMutation.mutateAsync({
        messageId: editMessageId,
        updatedMessage: editedMessage,
      });

      socket.emit("send-message", channelId);
      onEditToggle(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await deleteMessageMutation.mutateAsync({
        messageId: msg._id,
        userId: msg.sender.id,
      });
      socket.emit("send-message", channelId);
    } catch (err) {
      console.error(err);
    }
  };

  if (msg.pending && msg.previewImages?.length) {
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
              "min-h-[1.375rem]": shouldMergeMessages || msg.type === "system",
              "mt-0": msg.type === "system" && prevMessage?.type === "system",
              "mt-[1.0625rem]":
                msg.type === "system" && prevMessage?.type === "user",
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
              toggleEditMessageBox={toggleEditMessageBox}
              onEditMessage={handleEditMessage}
              onMessageChange={handleMessageChange}
              editedMessage={editedMessage}
            />
          )}
          {!isEditActive && (
            <MessageActions
              isYourMessage={isYourMessage}
              toggleEditMessageBox={toggleEditMessageBox}
              messageId={msg._id}
              messageType={msg.type}
              onDeleteMessage={handleDeleteMessage}
            />
          )}
        </div>
      </li>
    </>
  );
}
