"use client";

import { UserType } from "@/types/user";
import { UploadFile } from "../svgs";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import Image from "next/image";

export default function DmMessageBox({ recipient }: { recipient: UserType }) {
  const [message, setMessage] = useState("");

  const handleMessageSubmit = () => {
    console.log("Message to send:", message);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid newline on Enter.
      handleMessageSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };

  return (
    <form className="mx-4 -mt-2">
      <div className="pl-4 mb-6 bg-channel-text-area rounded-lg flex items-center">
        <button
          aria-label="Upload a file or send invites"
          className="-ml-4 rounded-[3px] px-4 py-2.5 h-[44px] flex items-center"
        >
          <UploadFile />
        </button>

        <div className="bg-transparent grow relative h-[44px]">
          <textarea
            className="border-0 outline-0 py-[11px] resize-none w-full h-full bg-channel-text-area overflow-hidden placeholder:text-channel-text-area-placeholder"
            placeholder={`Message @${recipient.displayName}`}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={message}
          ></textarea>
        </div>
        <div className="flex">
          <button className="p-1 mx-1">
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
    </form>
  );
}
