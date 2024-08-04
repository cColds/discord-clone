import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

type ImageExpandedProps = {
  imgUrl: string;
  children: React.ReactNode;
};

const ImageExpanded = ({ imgUrl, children }: ImageExpandedProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        removeCloseButton={true}
        className="p-0 gap-0 bg-transparent border-0"
      >
        <Image src={imgUrl} width={533} height={300} alt="" />

        <div>
          <a
            href={imgUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-sm opacity-50 hover:opacity-100 transition-opacity duration-150 ease-in-out"
          >
            Open in Browser
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageExpanded;
