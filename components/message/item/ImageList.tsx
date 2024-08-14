import Image from "next/image";
import ImageExpanded from "../../modals/channel/ImageExpanded";
import { MessageImage } from "@/types/message";
import { createImageGroups } from "@/utils/helpers/createImageGroups";

type ImageListProps = {
  images: MessageImage[];
};

const ImageList = ({ images }: ImageListProps) => {
  const imageGroups = createImageGroups(images);

  const imagesWithIndex = images.map((img, index) => ({
    ...img,
    index,
  }));

  return (
    <div className="grid h-fit grid-flow-row gap-1 grid-cols-auto-fill min-h-0 min-w-0 py-0.5">
      <div className="flex flex-wrap gap-2 max-w-[550px]">
        {imageGroups.map((group, groupIndex) => {
          return (
            <div
              key={groupIndex}
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${group.length}, 1fr)`,
              }}
            >
              {group.map((img) => {
                // Find the index of the image within the original array instead of group
                const imageIndex = images.findIndex(
                  (targetImg) => targetImg.id === img.id
                );

                const defaultImage = { ...img, index: imageIndex };

                return (
                  <div className="overflow-hidden" key={img.id}>
                    <ImageExpanded
                      images={imagesWithIndex}
                      defaultImage={defaultImage}
                    >
                      <div className="h-full max-h-[300px]">
                        <Image
                          key={img.id}
                          src={img.url}
                          alt=""
                          width={img.width || 500}
                          height={img.height || 300}
                          className="object-cover min-w-full min-h-full max-w-full h-full rounded-sm cursor-pointer"
                        />
                      </div>
                    </ImageExpanded>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageList;
