"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/tooltip/ActionButton";
import { Accept, Cancel } from "@/components/svgs";
import { cancelPendingRequest } from "@/lib/db/social/pending/cancelPendingRequest";
import { acceptPendingRequest } from "@/lib/db/social/pending/acceptPendingRequest";
import { useSocket } from "@/app/providers/SocketProvider";

const PendingActions = ({
  type,
  recipientId,
}: {
  type: "Incoming" | "Outgoing";
  recipientId: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const { socket } = useSocket();

  const senderId = session?.user.id;

  return (
    <>
      {type === "Incoming" ? (
        <>
          <ActionButton
            name="Accept"
            onClick={async (e) => {
              e.stopPropagation();

              try {
                if (!senderId) throw new Error("Your user id is invalid");
                await acceptPendingRequest(senderId, recipientId);

                socket.emit("accept-friend-request", {
                  senderId,
                  recipientId,
                });
              } catch (err) {
                console.error(err.message);
              }
            }}
            className="hover:text-info-positive-foreground"
          >
            <Accept />
          </ActionButton>
          <ActionButton
            name="Ignore"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                if (!senderId) throw new Error("Your user id is invalid");
                await cancelPendingRequest(senderId, recipientId);
                router.refresh();
              } catch (err) {
                console.error(err.message);
              }
            }}
            className="hover:text-info-danger-foreground"
          >
            <Cancel />
          </ActionButton>
        </>
      ) : (
        <ActionButton
          name="Cancel"
          onClick={async (e) => {
            e.stopPropagation();

            try {
              if (!senderId) throw new Error("Your user id is invalid");

              await cancelPendingRequest(senderId, recipientId);
            } catch (err) {
              console.error(err.message);
            }
            router.refresh();
          }}
          className="hover:text-info-danger-foreground"
        >
          <Cancel />
        </ActionButton>
      )}
    </>
  );
};

export default PendingActions;
