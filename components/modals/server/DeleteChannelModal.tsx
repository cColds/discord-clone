import { useSocket } from "@/app/providers/SocketProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteChannel } from "@/lib/actions/deleteChannel";
import { ServerType, TextOrVoiceChannel } from "@/types/server";
import { UserType } from "@/types/user";
import { useRouter } from "next-nprogress-bar";
import { useTransition } from "react";
type DeleteChannelModalProps = {
  onToggleModal: () => void;
  open: boolean;
  server: ServerType;
  user: UserType;
  channel: TextOrVoiceChannel;
  onToggleEditChannelModal: () => void;
};

const DeleteChannelModal = ({
  onToggleModal,
  onToggleEditChannelModal,
  open,
  server,
  user,
  channel,
}: DeleteChannelModalProps) => {
  const router = useRouter();
  const { socket } = useSocket();

  const [isPending, startTransition] = useTransition();

  const handleDeleteChannelClick = async () => {
    startTransition(async () => {
      try {
        const updatedServer = await deleteChannel({
          userId: user.id,
          serverId: server._id,
          channelId: channel._id,
        });

        onToggleModal();
        onToggleEditChannelModal();

        if (!updatedServer) return;

        const topLevelChannelLink =
          updatedServer.categories[0].channels[0]?._id || "";

        const serverLink =
          `/channels/servers/${updatedServer._id}/` + topLevelChannelLink;

        router.push(serverLink);

        socket.emit("updated-server", updatedServer.members);
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onToggleModal}>
      <DialogContent
        removeCloseButton={true}
        className="rounded bg-background-primary p-0 w-[440px] max-h-[720px] min-h-[200px]"
      >
        <DialogHeader className="p-4 overflow-hidden">
          <DialogTitle className="text-left text-xl truncate">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-text-normal text-md text-left">
            Are you sure you want to delete <strong>#{channel.name}</strong>?
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-background-secondary p-4">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="hover:underline text-sm"
              onClick={onToggleModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="font-semibold disabled:opacity-50 bg-button-danger-background hover:bg-button-danger-background-hover rounded active:bg-button-danger-background-active border-0 text-sm px-4 py-0.5 h-[38px] min-w-[96px]"
              onClick={handleDeleteChannelClick}
              disabled={isPending}
            >
              Delete Channel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
