import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type ImageExpandedProps = {
  images: { id: string; url: string; name: string }[];
  children: React.ReactNode;
};

const ImageExpanded = ({ images, children }: ImageExpandedProps) => {
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
        <Carousel>
          <CarouselContent>
            {images.map((img) => {
              return (
                <CarouselItem key={img.id}>
                  <Image src={img.url} width={533} height={300} alt="" />
                  <div>
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline text-sm opacity-50 hover:opacity-100 transition-opacity duration-150 ease-in-out"
                    >
                      Open in Browser
                    </a>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImageExpanded;
