import { Hash } from "@/components/svgs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextOrVoiceChannel } from "@/types/server";
import { ServerType } from "@/types/server";
import React from "react";

type CreateInviteModalProps = {
  children: React.ReactNode;
  server: ServerType;
  channel: TextOrVoiceChannel;
  inviteCode: string;
  open: boolean;
  onToggleOpen: () => void;
};

const CreateInviteModal = ({
  server,
  channel,
  children,
  inviteCode,
  open,
  onToggleOpen,
}: CreateInviteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onToggleOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background-primary p-0 rounded-sm w-[440px] min-h-[144px] max-h-[645px] flex flex-col gap-0">
        <DialogHeader className="flex text-left p-4">
          <DialogTitle className="text-base leading-5 font-bold mr-[28px] text-header-primary tracking-normal">
            Invite friends to {server.serverName}
          </DialogTitle>
          <DialogDescription className="flex items-center my-1 gap-2 text-interactive-normal mt-2">
            <Hash className="h-5 w-5" />

            <span className="text-base leading-5 font-normal">
              {channel.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-nowrap pl-4 pr-2 mb-5">
          <p className="mb-3 text-header-secondary text-sm leading-[18px] font-normal">
            Share this link with others to grant access to your server!
          </p>

          <div className="flex items-center justify-center text-base leading-4 rounded text-text-normal bg-input-background">
            <input
              name="invite"
              readOnly
              aria-label="Invite link"
              value={inviteCode}
              spellCheck={false}
              className="border-0 bg-transparent p-2.5 h-10 text rounded w-full grow"
            />

            <button className="text-white bg-brand-500 mr-1 w-[75px] min-h-[32px] min-w-[75px] h-8 transition hover:bg-brand-560 active:bg-brand-600 truncate text-sm leading-4 px-4 py-0.5">
              Copy
            </button>
          </div>

          <p className="text-text-muted text-xs leading-4 mt-2 font-normal">
            Your invite link will never expire.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInviteModal;
