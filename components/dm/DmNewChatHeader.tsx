import { UserType } from "@/types/user";
import Image from "next/image";
import DmButton from "./DmButton";

type DmNewChatHeaderType = {
  user: UserType;
  recipient: UserType;
};

export default function DmNewChatHeader({
  user,
  recipient,
}: DmNewChatHeaderType) {
  const isFriends = user.social.friends.some(
    (friend) => friend.id === recipient.id
  );

  const isBlocked = user.social.blocked.some(
    (friend) => friend.id === recipient.id
  );

  const receivedPendingRequest = user.social.pending.some(
    (pending) => pending.user.id === recipient.id
  );

  const friendRequestSent = recipient.social.pending.some(
    (pending) => pending.user.id === user.id
  );

  return (
    <div className="m-4">
      <Image
        src={recipient.avatar}
        alt={recipient.displayName}
        width={80}
        height={80}
        className="rounded-full"
      />
      <h3 className="my-2 font-bold text-[32px] leading-tight">
        {recipient.displayName}
      </h3>

      <div className="leading-tight">
        <h3 className="mb-5 text-[24px]">{recipient.username}</h3>
        <p className="text-header-secondary">
          This is the beginning of your direct message history with{" "}
          <strong>{recipient.displayName}</strong>.
        </p>
      </div>

      <div className="flex items-center mt-4">
        <p className="text-header-secondary text-sm leading-tight">
          No servers in common
        </p>

        <div className="w-1 h-1 mx-4 rounded-full bg-background-accent" />

        {isFriends ? (
          <DmButton
            text="Remove Friend"
            className="bg-button-secondary-background hover:bg-button-secondary-background-hover"
          />
        ) : isBlocked ? (
          <DmButton
            text="Unblock"
            className="bg-button-secondary-background hover:bg-button-secondary-background-hover"
          />
        ) : friendRequestSent ? (
          <DmButton
            text="Friend Request Sent"
            className="bg-brand-500 opacity-50 cursor-not-allowed"
            disabled={true}
          />
        ) : receivedPendingRequest ? (
          <>
            <p className="text-header-secondary mr-2 text-sm leading-tight">
              Sent you a friend request:
            </p>
            <DmButton
              text="Accept"
              className="bg-brand-500 hover:bg-brand-560"
            />
            <DmButton
              text="Ignore"
              className="bg-button-secondary-background hover:bg-button-secondary-background-hover"
            />
          </>
        ) : (
          <DmButton
            text="Add Friend"
            className="bg-brand-500 hover:bg-brand-560"
          />
        )}
      </div>
    </div>
  );
}
