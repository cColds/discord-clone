import Image from "next/image";
import ActionTooltip from "../../tooltip/ActionTooltip";
import { format } from "date-fns";
import { MessageType } from "@/types/message";
import UserProfileModal from "@/components/modals/UserProfileModal";
import MessageTimestamp from "./MessageTimestamp";
import { useState } from "react";

type MessageDetailsProps = {
  msg: MessageType & { pending?: boolean };
  shouldMergeMessages: boolean;
  formatted: string;
  editedDate: string;
  isEditActive: boolean;
};

const MessageDetails = ({
  msg,
  shouldMergeMessages,
  formatted,
  editedDate,
  isEditActive,
}: MessageDetailsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleToggleModal = (open: boolean) => setModalOpen(open);
  const messageSplit = msg.message.split("[!!{username}!!]");

  return (
    <div>
      {msg.type === "system" ? (
        <div>
          <div className="left-0 absolute w-[72px] flex items-center justify-center pt-1">
            <Image
              alt=""
              width={16}
              height={16}
              src="/images/icons/green-arrow.svg"
              className="select-none"
              draggable={false}
            />
          </div>
          <span className="text-channels-default text-md">
            {messageSplit[0]}
            <button
              onClick={() => handleToggleModal(true)}
              className="border-0 focus-visible:outline-2 focus-visible:outline-light-blue-outline leading-[1.375rem] text-header-primary overflow-hidden cursor-pointer hover:underline"
            >
              {msg.sender.displayName}
            </button>
            {messageSplit[1]}
          </span>

          <MessageTimestamp
            dateTime={msg.createdAt}
            formattedDate={formatted}
          />
        </div>
      ) : !shouldMergeMessages ? (
        <>
          <Image
            onClick={() => handleToggleModal(true)}
            src={msg.sender.avatar}
            alt=""
            width={40}
            height={40}
            className="rounded-full overflow-hidden cursor-pointer mt-0.5 select-none absolute left-4"
          />

          <h3 className="min-h-[1.375rem] leading-[1.375rem]">
            <button
              onClick={() => handleToggleModal(true)}
              className="break-all text-left border-0 focus-visible:outline-2 focus-visible:outline-light-blue-outline leading-[1.375rem] text-header-primary overflow-hidden mr-[0.25rem] cursor-pointer hover:underline"
            >
              {msg.sender.displayName}
            </button>

            <MessageTimestamp
              dateTime={msg.createdAt}
              formattedDate={formatted}
            />
          </h3>
        </>
      ) : (
        <span className="absolute left-0 w-[56px] text-[11px] leading-[1.375rem] select-none text-text-muted text-right opacity-0 group-hover:opacity-100">
          <MessageTimestamp
            ariaLabel={formatted}
            dateTime={msg.createdAt}
            formattedDate={format(msg.createdAt, "h:mm a")}
          />
        </span>
      )}

      {!isEditActive && msg.type === "user" && (
        <div className="text-text-normal overflow-hidden leading-[1.375rem]">
          <span
            className="whitespace-pre-wrap break-words"
            style={{ opacity: msg.pending ? 0.5 : undefined }}
          >
            {msg.message}
          </span>
          {msg.edited && (
            <ActionTooltip content={editedDate} delayDuration={500}>
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
      )}

      <UserProfileModal
        user={msg.sender}
        open={modalOpen}
        onToggleModal={handleToggleModal}
      />
    </div>
  );
};

export default MessageDetails;
