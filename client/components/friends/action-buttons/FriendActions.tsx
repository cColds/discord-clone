"use client";

import { useRouter } from "next/navigation";
import { Message, More } from "@/components/svgs";
import ActionButton from "@/components/tooltip/ActionButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unfriendUser } from "@/lib/db/social/friends/unfriendUser";
import { useSession } from "next-auth/react";

const FriendActions = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <ActionButton
        name="Message"
        onClick={() => router.push(`/channels/${id}`)}
      >
        <Message />
      </ActionButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ActionButton name="More" onClick={(e) => e.stopPropagation()}>
            <More />
          </ActionButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            Start Video Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            Start Voice Call
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={async (e) => {
              e.stopPropagation();

              console.log("Add remove friend logic");

              await unfriendUser(session?.user.id ?? "", id);

              router.refresh();
            }}
          >
            Remove Friend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FriendActions;
