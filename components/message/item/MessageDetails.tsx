import Image from "next/image";
import ActionTooltip from "../../tooltip/ActionTooltip";
import { format } from "date-fns";
import { MessageType } from "@/types/message";
import { transformCloudinaryUrl } from "@/utils/helpers/transformCloudinaryUrl";
import UserProfileModal from "@/components/modals/UserProfileModal";
import MessageTimestamp from "./MessageTimestamp";

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
  const transformation = "c_fill,h_80,w_80";

  const defaultAvatar = "/images/profile-pictures/blurple.png";

  const transformedAvatar =
    defaultAvatar === msg.sender.avatar
      ? msg.sender.avatar
      : transformCloudinaryUrl(msg.sender.avatar, transformation);

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
            <UserProfileModal user={msg.sender}>
              <button className="border-0 leading-[1.375rem] text-header-primary overflow-hidden cursor-pointer hover:underline">
                {msg.sender.displayName}
              </button>
            </UserProfileModal>
            {messageSplit[1]}
          </span>

          <MessageTimestamp
            dateTime={msg.createdAt}
            formattedDate={formatted}
          />
        </div>
      ) : !shouldMergeMessages ? (
        <>
          <UserProfileModal user={msg.sender}>
            <Image
              src={transformedAvatar}
              alt=""
              width={40}
              height={40}
              className="rounded-full overflow-hidden cursor-pointer mt-0.5 select-none absolute left-4"
            />
          </UserProfileModal>

          <h3 className="min-h-[1.375rem] leading-[1.375rem]">
            <UserProfileModal user={msg.sender}>
              <button className="border-0 leading-[1.375rem] text-header-primary overflow-hidden mr-[0.25rem] cursor-pointer hover:underline">
                {msg.sender.displayName}
              </button>
            </UserProfileModal>

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
            className="whitespace-pre-wrap"
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
    </div>
  );
};

export default MessageDetails;
