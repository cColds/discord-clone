import Image from "next/image";
import ActionTooltip from "../../tooltip/ActionTooltip";
import { format } from "date-fns";
import { MessageType } from "@/types/message";
import { transformCloudinaryUrl } from "@/utils/helpers/transformCloudinaryUrl";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { UserNormal } from "@/types/user";

type MessageDetailsProps = {
  msg: MessageType & { pending?: boolean };
  shouldMergeMessages: boolean;
  formatted: string;
  editedDate: string;
  isEditActive: boolean;
  user: UserNormal;
};

const MessageDetails = ({
  msg,
  shouldMergeMessages,
  formatted,
  editedDate,
  isEditActive,
  user,
}: MessageDetailsProps) => {
  const transformation = "c_fill,h_80,w_80";

  const defaultAvatar = "/images/profile-pictures/blurple.png";

  const transformedAvatar =
    defaultAvatar === msg.sender.avatar
      ? msg.sender.avatar
      : transformCloudinaryUrl(msg.sender.avatar, transformation);

  return (
    <div>
      {!shouldMergeMessages ? (
        <>
          <UserProfileModal user={user}>
            <Image
              src={transformedAvatar}
              alt=""
              width={40}
              height={40}
              className="rounded-full overflow-hidden cursor-pointer mt-0.5 select-none absolute left-4"
            />
          </UserProfileModal>

          <h3 className="min-h-[1.375rem] leading-[1.375rem]">
            <UserProfileModal user={user}>
              <button className="border-0 leading-[1.375rem] text-header-primary overflow-hidden mr-[0.25rem] cursor-pointer hover:underline">
                {msg.sender.displayName}
              </button>
            </UserProfileModal>

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
      {!isEditActive && (
        <div className="text-text-normal overflow-hidden leading-[1.375rem]">
          <span
            className="whitespace-pre-wrap"
            style={{ opacity: msg.pending ? 0.5 : undefined }}
          >
            {msg.message}
          </span>
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
      )}
    </div>
  );
};

export default MessageDetails;
