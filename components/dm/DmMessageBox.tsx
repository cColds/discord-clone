"use client";

import { UserType } from "@/types/user";
import { TypingDots } from "../svgs";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import Image from "next/image";
import { sendMessage } from "@/lib/actions/sendMessage";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import PreviewImagesList from "./PreviewImagesList";
import UploadFileDropdown from "./UploadFileDropdown";
import TextareaAutosize from "react-textarea-autosize";

type DmMessageBoxType = {
  recipient?: UserType;
  sender: UserType;
  channelName?: string;
  type: "dm" | "server";
};

type PreviewImageType = {
  name: string;
  id: string;
  url: string;
};

export default function DmMessageBox({
  recipient,
  sender,
  channelName,
  type,
}: DmMessageBoxType) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [usersTyping, setUsersTyping] = useState<
    { displayName: string; userId: string }[]
  >([]);
  const [previewImages, setPreviewImages] = useState<PreviewImageType[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);

  const socket = useTypingIndicator(setUsersTyping);
  const { channelId } = useParams();

  const handleMessageSubmit = async () => {
    try {
      const form = new FormData();
      form.append("message", message);
      if (filesToUpload) {
        for (let i = 0; i < filesToUpload.length; i += 1) {
          form.append("file[]", filesToUpload[i]);
        }
      }

      await sendMessage(
        sender.id,
        form,
        Array.isArray(channelId) ? channelId[0] : channelId,
        type
      );
      setMessage("");
      setPreviewImages([]);
      setFilesToUpload(null);

      socket.emit("send-message", channelId);
      socket.emit("stop-typing", channelId, {
        userId: sender.id,
        displayName: sender.displayName,
      });
      if (type === "dm") {
        socket.emit("update-dms-list", recipient?.id || "", sender.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isValidMessage = message.trim() || filesToUpload?.length;

    const hitEnter = e.key === "Enter" && !e.shiftKey;

    if (hitEnter && !isValidMessage) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value !== "") {
      socket.emit("typing-indicator", channelId, {
        userId: sender.id,
        displayName: sender.displayName,
      });
    }
    setMessage(e.currentTarget.value);
  };

  const toggleDropdownMenu = () => {
    setOpen(!open);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggleDropdownMenu();

    const files = e.currentTarget.files;

    if (!files) return;

    const newFiles = Array.from(files).map((file) => {
      return { name: file.name, id: uuidv4(), url: URL.createObjectURL(file) };
    });

    setFilesToUpload(files);

    setPreviewImages((prevState) => [...prevState, ...newFiles]);
  };

  const handleRemovePreviewImage = (id: string) => {
    const filteredImages = previewImages.filter(
      (previewImage) => previewImage.id !== id
    );

    setPreviewImages(filteredImages);
  };

  return (
    <form className="px-4 shrink-0 -mt-2 z-10 relative">
      <div className="bg-background-primary">
        <div className="overflow-hidden bg-channel-text-area rounded-lg mb-6">
          {previewImages.length ? (
            <PreviewImagesList
              previewImages={previewImages}
              onRemovePreviewImage={handleRemovePreviewImage}
            />
          ) : null}

          <div className="pl-4 rounded-lg flex items-start">
            <UploadFileDropdown
              open={open}
              toggleDropdownMenu={toggleDropdownMenu}
              onFileChange={handleFileChange}
            />
            <div className="bg-transparent grow relative max-h-1/2 flex items-center min-h-[44px]">
              <TextareaAutosize
                className={`border-0 outline-0 max-h-1/2 h-[24px] py-2.5 resize-none w-full bg-channel-text-area overflow-x-hidden overflow-y-auto placeholder:text-channel-text-area-placeholder`}
                placeholder={`Message ${
                  recipient ? `@${recipient?.displayName}` : `#${channelName}`
                }`}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                value={message}
              />
            </div>
            <div className="flex">
              <div className="flex items-center h-11 w-10">
                <button className="p-1 mx-1 border-0" type="button">
                  <Image
                    src="/images/emojis/slightly_smiling_face.png"
                    alt=""
                    width={24}
                    height={24}
                    className="select-none"
                    draggable={false}
                  />
                </button>
              </div>
            </div>
          </div>
          {usersTyping.length > 0 && (
            <div className="text-sm leading-6 resize-none flex items-center absolute bottom-[1px] left-4 right-4 h-6">
              <div className="flex items-center overflow-hidden text-ellipsis">
                <TypingDots className="ml-[9px]" />
                <span className="min-w-0 truncate ml-1">
                  <strong>
                    {usersTyping.map((users) => users.displayName).join(", ")}
                  </strong>{" "}
                  is typing...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
