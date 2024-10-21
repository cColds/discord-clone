import { useSocket } from "@/app/providers/SocketProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { leaveServer } from "@/lib/db/leaveServer";
import { ServerType } from "@/types/server";
import { UserType } from "@/types/user";
import { useRouter } from "next-nprogress-bar";
type LeaveServerModalProps = {
  toggleLeaveServerModal: (open: boolean) => void;
  open: boolean;
  server: ServerType;
  user: UserType;
};

const LeaveServerModal = ({
  toggleLeaveServerModal,
  open,
  server,
  user,
}: LeaveServerModalProps) => {
  const router = useRouter();
  const { socket } = useSocket();

  const handleLeaveServerClick = async () => {
    toggleLeaveServerModal(false);
    const serverDoc = await leaveServer(user.id, server._id);

    if (!serverDoc) {
      console.error("Error leaving server");
      return;
    }

    router.push("/");
    socket.emit(
      "update-server",
      server.members.map((m) => m.id)
    );
  };

  return (
    <Dialog open={open} onOpenChange={toggleLeaveServerModal}>
      <DialogContent
        removeCloseButton={true}
        className="rounded bg-background-primary p-0 w-[440px] max-h-[720px] min-h-[200px]"
      >
        <DialogHeader className="p-4 overflow-hidden">
          <DialogTitle className="text-left text-xl truncate">
            Leave &apos;{server.serverName}&apos;
          </DialogTitle>
          <DialogDescription className="text-text-normal text-md text-left">
            Are you sure you want to leave <strong>{server.serverName}</strong>?
            You won&apos;t be able to rejoin this server unless you are
            re-invited.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-background-secondary p-4">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="hover:underline text-sm"
              onClick={() => toggleLeaveServerModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="font-semibold bg-button-danger-background hover:bg-button-danger-background-hover rounded active:bg-button-danger-background-active border-0 text-sm px-4 py-0.5 h-[38px] min-w-[96px]"
              onClick={handleLeaveServerClick}
            >
              Leave Server
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
