"use client";

import { UserType } from "@/types/user";
import { TypingDots, UploadFile } from "../svgs";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sendMessage } from "@/lib/actions/sendMessage";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/providers/SocketProvider";

type DmMessageBoxType = {
  recipient: UserType;
  sender: UserType;
};

export default function DmMessageBox({ recipient, sender }: DmMessageBoxType) {
  const [message, setMessage] = useState("");
  const [usersTyping, setUsersTyping] = useState<
    { displayName: string; userId: string }[]
  >([]);
  const typingTimerRef = useRef<null | NodeJS.Timeout>(null);

  const { channelId } = useParams();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "show-typing-indicator",
      (user: { displayName: string; userId: string }) => {
        setUsersTyping((current) => {
          const isUserAlreadyTyping = current.some(
            (u) => u.userId === user.userId
          );

          if (!isUserAlreadyTyping) {
            if (typingTimerRef?.current) {
              clearTimeout(typingTimerRef?.current);
            }

            const timerId = setTimeout(() => {
              setUsersTyping((current) =>
                current.filter((u) => u.userId !== user.userId)
              );
            }, 10000);

            typingTimerRef.current = timerId;

            return [...current, user];
          }
          return current;
        });
      }
    );
    socket.on(
      "stop-typing-indicator",
      (user: { displayName: string; userId: string }) => {
        setUsersTyping((current) =>
          current.filter((u) => u.userId !== user.userId)
        );
      }
    );

    return () => {
      socket.off("show-typing-indicator");
      socket.off("stop-typing-indicator");

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [socket]);

  const handleMessageSubmit = async () => {
    try {
      console.log("Message to send:", message);

      await sendMessage(
        sender.id,
        message,
        Array.isArray(channelId) ? channelId[0] : channelId
      );
      setMessage("");

      socket.emit("send-message", channelId);
      socket.emit("stop-typing", channelId, {
        userId: sender.id,
        displayName: sender.displayName,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid newline on Enter.
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

  return (
    <form className="px-4 shrink-0 -mt-2 z-10 relative">
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
    </form>
  );
}
