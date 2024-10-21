import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

type LogOutModalProps = {
  open: boolean;
  toggleModal: (open: boolean) => void;
};

export default function LogOutModal({ open, toggleModal }: LogOutModalProps) {
  const handleLogOut = async () => {
    try {
      await signOut();

      toggleModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog onOpenChange={toggleModal} open={open}>
      <DialogContent
        removeCloseButton={true}
        className="rounded bg-background-primary p-0 w-[440px] max-h-[720px] min-h-[200px]"
      >
        <DialogHeader className="p-4 overflow-hidden text-left">
          <h1 className="font-bold text-header-primary text-2xl">Log Out</h1>

          <p className="text-header-secondary mt-2 text-md leading-5">
            Are you sure you want to logout?
          </p>
        </DialogHeader>
        <DialogFooter className="bg-background-secondary p-4">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="hover:underline text-sm"
              onClick={() => toggleModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="font-semibold bg-button-danger-background hover:bg-button-danger-background-hover rounded active:bg-button-danger-background-active border-0 text-sm px-4 py-0.5 h-[38px] min-w-[96px]"
              onClick={handleLogOut}
            >
              Log Out
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
