import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type EmojiPickerProps = {
  onChange: (emoji: string) => void;
};
const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex">
        <div className="flex justify-center items-center h-11 mr-2">
          <PopoverTrigger asChild>
            <button
              className="flex items-center justify-center group p-1.5 border-0 transition duration-200 hover:bg-background-interactive-hover"
              type="button"
            >
              <Smile className="group-hover:text-yellow-400" />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          side="right"
          sideOffset={40}
          className="border-0 shadow-none mb-16 p-0"
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              onChange(emoji.native);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default EmojiPicker;
