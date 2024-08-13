import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageImage } from "@/types/message";
import Image from "next/image";
import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

interface MessageImageWithIndex extends MessageImage {
  index: number;
}

type ImageExpandedProps = {
  images: MessageImageWithIndex[];
  defaultImage: MessageImageWithIndex;
  children: React.ReactNode;
};

const ImageExpanded = ({
  images,
  defaultImage,
  children,
}: ImageExpandedProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(defaultImage);

  const handleCarouselChange = (updateIndex: -1 | 1) => {
    console.log("clicked");
    const currentIndex = selectedImage.index;

    const newIndex = currentIndex + updateIndex;

    const isOutOfBounds = newIndex < 0 || newIndex > images.length - 1;

    let updatedImage = images[newIndex];
    if (isOutOfBounds) {
      const lastImage = images[images.length - 1];

      if (updateIndex === -1) updatedImage = lastImage;
      else updatedImage = images[0];
    }

    setSelectedImage(updatedImage);
  };

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
        className="p-0 gap-0 bg-transparent border-0 w-auto max-w-full"
      >
        <div className="relative">
          <Image
            src={selectedImage.url}
            width={selectedImage.width || 719}
            height={selectedImage.height || 500}
            alt=""
          />
          <div>
            <a
              href={selectedImage.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-sm opacity-50 hover:opacity-100 transition-opacity duration-150 ease-in-out"
            >
              Open in Browser
            </a>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={() => handleCarouselChange(-1)}
                className="flex items-center justify-center rounded-full  w-8 h-8 cursor-pointer absolute -left-8 top-[50%] -translate-x-[50%] -translate-y-[50%] bg-background hover:bg-accent duration-150 transition ease-in-out border border-input"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleCarouselChange(1)}
                className="flex items-center justify-center rounded-full w-8 h-8 cursor-pointer absolute -right-8 top-[50%] translate-x-[50%] -translate-y-[50%] bg-background hover:bg-accent duration-150 transition ease-in-out border border-input"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageExpanded;
