import Image from "next/image";

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
  return (
    <div>
      <div className="mt-2 min-h-[44px] text-text-normal leading-[1.375rem]">
        <div className="flex bg-channel-text-area rounded-lg">
          <textarea
            className="border-0 outline-0 pl-4 pr-2.5 py-[11px] resize-none w-full bg-channel-text-area overflow-hidden rounded-lg h-[44px]"
            value={editedMessage === null ? message : editedMessage}
            onChange={(e) => updateEditedMessage(e.target.value)}
          ></textarea>

          <div className="flex">
            <button className="p-1 mx-1">
              <Image
                src="/images/emojis/slightly_smiling_face.png"
                alt=""
                width={24}
                height={24}
                className="select-none"
                draggable={false}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="py-[7px] text-xs text-text-normal leading-3">
        escape to
        <button
          className="text-text-link duration-[50] cursor-pointer"
          onClick={() => onEditMessage(null)}
        >
          cancel
        </button>
        • enter to
        <button
          className="text-text-link duration-[50] cursor-pointer"
          onClick={() => {
            try {
              onEditMessage(null);
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
