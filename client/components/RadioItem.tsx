import { cn } from "@/lib/utils";
import { Hash, Volume } from "./svgs";
import { RadioButton } from "./svgs/RadioButton";
import { RadioButtonFilled } from "./svgs/RadioButtonFilled";

type RadioItemType = {
  channelType: "text" | "voice";
  onRadioItemClick: (updatedChannelType: "text" | "voice") => void;
  selectedChannelType: "text" | "voice";
};

const RadioItem = ({
  channelType,
  onRadioItemClick,
  selectedChannelType,
}: RadioItemType) => {
  return (
    <button
      role="radio"
      aria-checked={selectedChannelType === channelType}
      type="button"
      className={cn(
        "bg-background-secondary text-interactive-active mb-2 rounded w-full transition-none border-0",
        {
          "bg-background-modifier-selected":
            selectedChannelType === channelType,
          "hover:bg-background-modifier-hover":
            selectedChannelType !== channelType,
        }
      )}
      onClick={() => onRadioItemClick(channelType)}
    >
      <div className="flex py-2.5 px-3 gap-2 items-center">
        <div className="mr-2 w-full flex gap-1 items-center">
          {channelType === "text" ? (
            <Hash className="opacity-60 mr-3 fill-primary-300" />
          ) : (
            <Volume className="opacity-60 mr-3 fill-primary-300" />
          )}

          <div>
            <p className="text-md leading-5 font-medium text-start capitalize">
              {channelType}
            </p>
            <p className="mt-1 text-header-secondary whitespace-prewrap text-sm font-normal text-start">
              {channelType === "text"
                ? "Send messages, images, GIFs, emoji, opinions, and puns"
                : "Hang out together with voice, video, and screen share"}
            </p>
          </div>
        </div>

        <div>
          {selectedChannelType === channelType ? (
            <RadioButtonFilled />
          ) : (
            <RadioButton />
          )}
        </div>
      </div>
    </button>
  );
};

export default RadioItem;
