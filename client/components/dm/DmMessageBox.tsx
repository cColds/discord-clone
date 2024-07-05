"use client";

import { UserType } from "@/types/user";
import { TypingDots, AttachmentPlus, UploadFile, Trash } from "../svgs";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sendMessage } from "@/lib/actions/sendMessage";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/providers/SocketProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActionTooltip from "../tooltip/ActionTooltip";
import { v4 as uuidv4 } from "uuid";

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
  const [usersTyping, setUsersTyping] = useState<
    { displayName: string; userId: string }[]
  >([]);
  const typingTimerRef = useRef<null | NodeJS.Timeout>(null);

  const { channelId } = useParams();

  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<PreviewImageType[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);

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

      // May need to pass FileList of files to form data and replace message with that
      // still need to figure how to upload multiple img to cloudinary

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

  const toggleDropdownMenu = () => {
    setOpen(!open);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggleDropdownMenu();

    // Store and loop through all image blobs

    const files = e.currentTarget.files;

    console.log("Files to upload: ", files);

    if (!files) return;

    const newFiles = Array.from(files).map((file) => {
      return { name: file.name, id: uuidv4(), url: URL.createObjectURL(file) };
    });

    setFilesToUpload(files);

    // Set preview images to the blobs

    setPreviewImages((prevState) => [...prevState, ...newFiles]);
  };

  const handleRemovePreviewImage = (id: string) => {
    const filteredImages = previewImages.filter(
      (previewImage) => previewImage.id !== id
    );

    setPreviewImages(filteredImages);

    // todo update mongodb schema to include image urls
  };

  return (
    <form className="px-4 shrink-0 -mt-2 z-10 relative">
      <div className="bg-background-primary">
        <div className="overflow-hidden bg-channel-text-area rounded-lg mb-6">
          {previewImages.length ? (
            <>
              <ul className="flex gap-6 mb-0.5 ml-1.5 p-2.5 pt-5 overflow-x-auto">
                {previewImages.map((previewImage) => {
                  return (
                    <li
                      key={previewImage.id}
                      className="flex flex-col rounded bg-background-secondary p-2 min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px] relative"
                    >
                      <div className="overflow-hidden bg-spoiler mt-auto">
                        <Image
                          src={previewImage.url}
                          alt=""
                          width={200}
                          height={112.5}
                          className="max-w-full object-contain rounded-[3px] aspect-video h-full"
                        />
                      </div>
                      <div className="mt-auto">
                        <div className="overflow-hidden truncate text-sm">
                          {previewImage.name}
                        </div>
                      </div>

                      <div
                        aria-label="Upload Attachment Utilities"
                        className="absolute right-0 translate-x-[25%] translate-y-[-25%] z-50"
                      >
                        <div className="shadow-elevation-low bg-background-primary h-8 rounded flex items-center transition duration-100 overflow-hidden hover:shadow-elevation-high">
                          <ActionTooltip content="Remove Attachment">
                            <button
                              aria-label="Remove Attachment"
                              type="button"
                              className="text-status-danger p-1 min-w-[24px] w-8 flex items-center justify-center h-8 cursor-pointer border-0 leading-4 hover:bg-background-modifier-hover duration-100"
                              onClick={() =>
                                handleRemovePreviewImage(previewImage.id)
                              }
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </ActionTooltip>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="h-0 pointer-events-none border-background-modifier-accent border-[1px]" />
            </>
          ) : null}

          <div className="pl-4 rounded-lg flex items-center">
            <DropdownMenu open={open} onOpenChange={toggleDropdownMenu}>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Upload a file or send invites"
                  className="-ml-4 rounded-[3px] px-4 py-2.5 h-[44px] flex items-center text-interactive-normal hover:text-interactive-hover border-0 focus-visible:border-2"
                  type="button"
                >
                  <AttachmentPlus />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                aria-label="Channel Actions"
                className="shadow-elevation-high min-w-[200px] max-w-0 shadow-elevation-high rounded bg-background-floating"
              >
                <DropdownMenuItem
                  className="text-interactive-normal flex items-center bg-background-floating min-h-[32px] p-0 my-0.5 rounded-sm text-sm leading-[18px] hover:text-white hover:bg-brand-500 focus:text-white focus:bg-brand-500 cursor-pointer py-1.5 px-2"
                  onSelect={(e) => e.preventDefault()}
                >
                  <div className="flex items-center">
                    <label
                      htmlFor="upload-file"
                      className="flex items-center grow"
                    >
                      <UploadFile />
                    </label>
                    <span className="ml-2">Upload a File</span>
                  </div>
                  <input
                    type="file"
                    className="absolute w-full h-full opacity-0 left-0"
                    id="upload-file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleFileChange}
                    onClick={(e) => console.log("TEST", e.currentTarget.files)}
                    name="upload-file"
                    multiple={true}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="bg-transparent grow relative h-[44px]">
              <textarea
                className="border-0 outline-0 py-[11px] resize-none w-full h-full bg-channel-text-area overflow-hidden placeholder:text-channel-text-area-placeholder"
                placeholder={`Message ${
                  recipient ? `@${recipient?.displayName}` : `#${channelName}`
                }`}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                value={message}
              ></textarea>
            </div>
            <div className="flex">
              <button className="p-1 mx-1" type="button">
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
        </div>
      </div>
    </form>
  );
}
