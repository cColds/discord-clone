import Image from "next/image";
import ImageExpanded from "../modals/channel/ImageExpanded";
import { MessageImage } from "@/types/message";

type ImageListProps = {
  images: MessageImage[];
};

const ImageList = ({ images }: ImageListProps) => {
  return (
    <div className="grid h-fit grid-flow-row gap-1 grid-cols-auto-fill min-h-0 min-w-0 py-0.5">
      <div className="flex gap-1">
        {images?.map((img, index) => {
          const imagesWithIndex = images.map((img, index) => ({
            ...img,
            index,
          }));

          const defaultImage = { ...img, index };

          return (
            <div className="overflow-hidden" key={img.id}>
              <ImageExpanded
                images={imagesWithIndex}
                defaultImage={defaultImage}
              >
                <Image
                  key={img.id}
                  src={img.url}
                  alt=""
                  width={200}
                  height={200}
                  className="object-cover min-w-full min-h-full max-w-full h-full rounded-sm cursor-pointer"
                />
              </ImageExpanded>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageList;
