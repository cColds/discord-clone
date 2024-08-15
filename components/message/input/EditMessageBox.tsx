import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "./EmojiPicker";
import { KeyboardEvent, useEffect } from "react";

type EditMessageBoxType = {
  message: string;
  editedMessage: string | null;
  onEditMessage: (messageId: string | null) => void;
  saveMessageChange: () => void;
  updateEditedMessage: (message: string) => void;
};

const EditMessageBox = ({
  message,
  editedMessage,
  onEditMessage,
  saveMessageChange,
  updateEditedMessage,
}: EditMessageBoxType) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isValidMessage = editedMessage?.trim();

    const hitEnter = e.key === "Enter" && !e.shiftKey;

    if (hitEnter && !isValidMessage) {
      e.preventDefault();
      onEditMessage(null);
      return;
    }

    if (hitEnter) {
      e.preventDefault();
      saveMessageChange();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") onEditMessage(null);
    });

    return () =>
      window.removeEventListener("keydown", (e) => onEditMessage(null));
  }, []);

  return (
    <div>
      <div className="mt-2 min-h-[44px] text-text-normal leading-[1.375rem]">
        <div className="flex bg-channel-text-area rounded-lg">
          <TextareaAutosize
            className="border-0 outline-0 pl-4 pr-2.5 py-[11px] resize-none w-full bg-channel-text-area overflow-x-hidden overflow-y-auto rounded-lg h-[44px] max-h-[300px]"
            value={editedMessage === null ? message : editedMessage}
            onChange={(e) => updateEditedMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          ></TextareaAutosize>

          <EmojiPicker />
        </div>
      </div>

      <div className="py-[7px] text-xs text-text-normal leading-3">
        escape to
        <button
          className="text-text-link duration-75 cursor-pointer"
          onClick={() => onEditMessage(null)}
        >
          cancel
        </button>
        • enter to
        <button
          className="text-text-link duration-75 cursor-pointer"
          onClick={() => {
            try {
              const isValidMessage = editedMessage?.trim();

              onEditMessage(null);

              if (!isValidMessage) return;

              saveMessageChange();
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
