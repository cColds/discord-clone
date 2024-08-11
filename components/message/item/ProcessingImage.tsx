import { Close } from "@/components/svgs";
import Image from "next/image";

const ProcessingImage = () => {
  return (
    <div className="flex mt-[1.0625rem] py-0.5 pl-[72px] pr-[48px]">
      <div className="border-background-secondary-alt bg-background-secondary flex items-center rounded-sm max-w-[520px] w-full p-2.5 border-[1px]">
        <Image
          src="/images/icons/file-attachment.svg"
          title="unknown"
          alt="Attachment file type: unknown"
          width={30}
          height={40}
          className="shrink-0 mr-2"
        />

        <div className="flex-grow">
          <p className="truncate text-interactive-active text-md">
            Processing image...
          </p>

          <div className="mr-2 h-4 flex items-center">
            <div className="bg-background-modifier-accent h-1.5 rounded-sm w-full overflow-hidden"></div>
          </div>
        </div>
        <button>
          <Close className="text-interactive-normal ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ProcessingImage;
