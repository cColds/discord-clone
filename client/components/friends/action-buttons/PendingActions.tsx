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
  id,
}: {
  type: "Incoming" | "Outgoing";
  id: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const { socket } = useSocket();

  return (
    <>
      {type === "Incoming" ? (
        <>
          <ActionButton
            name="Accept"
            onClick={async (e) => {
              e.stopPropagation();

              try {
                const accepterId = session?.user.id;
                const requesterId = id;

                if (!accepterId) throw new Error("Your user id is invalid");
                await acceptPendingRequest(session.user.id, id);

                socket.emit("accept-friend-request", {
                  accepterId,
                  requesterId,
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

              await cancelPendingRequest(session?.user.id ?? "", id);
              router.refresh();
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

            await cancelPendingRequest(session?.user.id ?? "", id);
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
