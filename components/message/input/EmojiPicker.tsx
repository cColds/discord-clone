import Image from "next/image";

const EmojiPicker = () => {
  return (
    <div className="flex">
      <div className="flex items-center h-11 w-10">
        <button className="p-1 mx-1 border-0" type="button">
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
  );
};

export default EmojiPicker;
