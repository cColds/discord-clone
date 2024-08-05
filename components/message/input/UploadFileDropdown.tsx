import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AttachmentPlus, UploadFile } from "../../svgs";
import { ChangeEvent } from "react";

type UploadFileDropdownType = {
  open: boolean;
  toggleDropdownMenu: (open: boolean) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const UploadFileDropdown = ({
  open,
  toggleDropdownMenu,
  onFileChange,
}: UploadFileDropdownType) => {
  return (
    <DropdownMenu open={open} onOpenChange={toggleDropdownMenu}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Upload a file or send invites"
          className="-ml-4 rounded-[3px] px-4 py-2.5 h-[44px] flex items-center text-interactive-normal hover:text-interactive-hover border-0 focus-visible:border-2"
          type="button"
        >
          <AttachmentPlus />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        aria-label="Channel Actions"
        className="shadow-elevation-high min-w-[200px] max-w-0 shadow-elevation-high rounded bg-background-floating"
      >
        <DropdownMenuItem
          className="text-interactive-normal flex items-center bg-background-floating min-h-[32px] p-0 my-0.5 rounded-sm text-sm leading-[18px] hover:text-white hover:bg-brand-500 focus:text-white focus:bg-brand-500 cursor-pointer py-1.5 px-2"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center">
            <label htmlFor="upload-file" className="flex items-center grow">
              <UploadFile />
            </label>
            <span className="ml-2">Upload a File</span>
          </div>
          <input
            type="file"
            className="absolute w-full h-full opacity-0 left-0"
            id="upload-file"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={onFileChange}
            name="upload-file"
            multiple={true}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UploadFileDropdown;
