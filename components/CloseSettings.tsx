import { Close } from "./svgs";

const CloseSettings = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="shrink-0 flex flex-col items-center fixed group">
      <button
        className="text-interactive-normal flex justify-center items-center shrink-0 w-9 h-9 cursor-pointer rounded-full border-2 border-interactive-normal hover:border-interactive-hover hover:bg-background-modifier-hover hover:text-interactive-hover active:text-interactive-active active:translate-y-[1px] peer"
        onClick={onClose}
      >
        <Close className="w-[18px] h-[18px]" />
      </button>
      <span
        aria-hidden={true}
        className="text-interactive-normal mt-2 text-bold text-[13px] peer-hover:text-interactive-hover peer-active:text-interactive-active"
      >
        ESC
      </span>
    </div>
  );
};

export default CloseSettings;
