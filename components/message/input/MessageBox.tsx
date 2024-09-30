"use client";

import { UserType } from "@/types/user";
import PreviewImagesList from "./PreviewImagesList";
import UploadFileDropdown from "./UploadFileDropdown";
import TextareaAutosize from "react-textarea-autosize";
import TypingIndicator from "./TypingIndicator";
import EmojiPicker from "./EmojiPicker";
import useMessageHandler from "@/hooks/useMessageHandler";
import { useEffect, useRef } from "react";

type MessageBoxType = {
  recipient?: UserType;
  sender: UserType;
  channelName?: string;
  type: "dm" | "server";
};

export default function MessageBox({
  recipient,
  sender,
  channelName,
  type,
}: MessageBoxType) {
  const {
    message,
    open,
    previewImages,
    usersTyping,
    handleChange,
    handleFileChange,
    handleKeyDown,
    handleRemovePreviewImage,
    toggleDropdownMenu,
  } = useMessageHandler({ sender, recipient, type });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        if (/^[a-zA-Z0-9]$/i.test(event.key)) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
                className={`border-0 outline-0 max-h-1/2 h-[44px] py-2.5 resize-none w-full bg-channel-text-area overflow-x-hidden overflow-y-auto placeholder:text-channel-text-area-placeholder`}
                placeholder={`Message ${
                  recipient ? `@${recipient?.displayName}` : `#${channelName}`
                }`}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                value={message}
                ref={inputRef}
              />
            </div>
            <EmojiPicker />
          </div>
          <TypingIndicator usersTyping={usersTyping} />
        </div>
      </div>
    </form>
  );
}
