import { UploadNewImage } from "@/components/svgs/UploadNewImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ChangeEvent, useState } from "react";

type EditAvatarModalProps = {
  onAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
};

export default function EditAvatarModal({
  onAvatarChange,
  children,
}: EditAvatarModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background-primary p-0 rounded-sm min-h-[200px] w-[440px] max-h-[720px] flex flex-col">
        <DialogHeader className="py-4 px-5">
          <DialogTitle className="text-left mb-2 text-xl text-header-primary">
            Select an Image
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 overflow-hidden">
          <div className="flex justify-center">
            <button className="mr-4 relative bg-background-secondary-alt p-4 rounded-sm w-[192px] border-0 group">
              <div className="h-32 w-32 bg-brand-500 rounded-full mx-auto flex justify-center items-center overflow-hidden">
                <UploadNewImage className="text-white" />
              </div>
              <p className="text-interactive-normal text-sm font-semibold truncate mt-4 group-hover:text-interactive-active transition duration-200">
                Upload Image
              </p>
              <input
                type="file"
                className="absolute left-0 top-0 w-full h-full overflow-hidden opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={(e) => {
                  onAvatarChange(e);

                  setOpen(false);
                }}
              />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
