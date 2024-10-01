import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "./EmojiPicker";
import { KeyboardEvent, useEffect } from "react";

type EditMessageBoxType = {
  message: string;
  editedMessage: string | null;
  toggleEditMessageBox: (messageId: string | null) => void;
  onEditMessage: () => void;
  onMessageChange: (message: string) => void;
};

const EditMessageBox = ({
  message,
  editedMessage,
  toggleEditMessageBox,
  onEditMessage,
  onMessageChange,
}: EditMessageBoxType) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isValidMessage = editedMessage?.trim();

    const hitEnter = e.key === "Enter" && !e.shiftKey;

    if (hitEnter && !isValidMessage) {
      e.preventDefault();
      toggleEditMessageBox(null);
      return;
    }

    if (hitEnter) {
      e.preventDefault();
      onEditMessage();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleEditMessageBox(null);
    });

    return () =>
      window.removeEventListener("keydown", () => toggleEditMessageBox(null));
  }, []);

  return (
    <div>
      <div className="mt-2 min-h-[44px] text-text-normal leading-[1.375rem]">
        <div className="flex bg-channel-text-area rounded-lg">
          <TextareaAutosize
            className="border-0 outline-0 pl-4 pr-2.5 py-[11px] resize-none w-full bg-channel-text-area overflow-x-hidden overflow-y-auto rounded-lg h-[44px] max-h-[300px]"
            value={editedMessage === null ? message : editedMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            onFocus={(e) => {
              // Autofocus seems to trigger before value is set so this will put the caret at the end instead of the start
              const { value } = e.target;
              e.target.value = "";
              e.target.value = value;
            }}
          ></TextareaAutosize>

          <EmojiPicker />
        </div>
      </div>

      <div className="py-[7px] text-xs text-text-normal leading-3">
        escape to
        <button
          className="text-text-link duration-75 cursor-pointer"
          onClick={() => toggleEditMessageBox(null)}
        >
          cancel
        </button>
        • enter to
        <button
          className="text-text-link duration-75 cursor-pointer"
          onClick={() => {
            try {
              const isValidMessage = editedMessage?.trim();

              toggleEditMessageBox(null);

              if (!isValidMessage) return;

              onEditMessage();
            } catch (err) {
              console.error(err);
            }
          }}
        >
          save
        </button>
      </div>
    </div>
  );
};

export default EditMessageBox;
