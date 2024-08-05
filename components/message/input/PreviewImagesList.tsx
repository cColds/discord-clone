import Image from "next/image";
import { Trash } from "../../svgs";
import ActionTooltip from "../../tooltip/ActionTooltip";

type PreviewImagesListType = {
  previewImages: { name: string; id: string; url: string }[];

  onRemovePreviewImage: (id: string) => void;
};

const PreviewImagesList = ({
  previewImages,
  onRemovePreviewImage,
}: PreviewImagesListType) => {
  return (
    <>
      <ul className="flex gap-6 mb-0.5 ml-1.5 p-2.5 pt-5 overflow-x-auto">
        {previewImages.map((previewImage) => {
          return (
            <li
              key={previewImage.id}
              className="flex flex-col rounded bg-background-secondary p-2 min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px] relative"
            >
              <div className="overflow-hidden bg-spoiler mt-auto">
                <Image
                  src={previewImage.url}
                  alt=""
                  width={200}
                  height={112.5}
                  className="max-w-full object-contain rounded-[3px] aspect-video h-full"
                />
              </div>
              <div className="mt-auto">
                <div className="overflow-hidden truncate text-sm">
                  {previewImage.name}
                </div>
              </div>

              <div
                aria-label="Upload Attachment Utilities"
                className="absolute right-0 translate-x-[25%] translate-y-[-25%] z-50"
              >
                <div className="shadow-elevation-low bg-background-primary h-8 rounded flex items-center transition duration-100 overflow-hidden hover:shadow-elevation-high">
                  <ActionTooltip content="Remove Attachment">
                    <button
                      aria-label="Remove Attachment"
                      type="button"
                      className="text-status-danger p-1 min-w-[24px] w-8 flex items-center justify-center h-8 cursor-pointer border-0 leading-4 hover:bg-background-modifier-hover duration-100"
                      onClick={() => onRemovePreviewImage(previewImage.id)}
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </ActionTooltip>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="h-0 pointer-events-none border-background-modifier-accent border-[1px]" />
    </>
  );
};

export default PreviewImagesList;
