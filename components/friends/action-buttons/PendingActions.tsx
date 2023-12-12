"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/tooltip/ActionButton";
import { Accept, Cancel } from "@/components/svgs";
import { cancelPendingRequest } from "@/lib/db/social/pending/cancelPendingRequest";
import { acceptPendingRequest } from "@/lib/db/social/pending/acceptPendingRequest";

const PendingActions = ({
  type,
  id,
}: {
  type: "Incoming" | "Outgoing";
  id: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      {type === "Incoming" ? (
        <>
          <ActionButton
            name="Accept"
            onClick={async (e) => {
              e.stopPropagation();

              await acceptPendingRequest(session?.user.id ?? "", id);
              router.refresh();
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
