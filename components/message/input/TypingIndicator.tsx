import { TypingDots } from "@/components/svgs";

type TypingIndicatorProps = {
  usersTyping: { displayName: string; userId: string }[];
};

const TypingIndicator = ({ usersTyping }: TypingIndicatorProps) => {
  if (usersTyping.length < 1) return null;

  return (
    <div className="text-sm leading-6 resize-none flex items-center absolute bottom-[1px] left-4 right-4 h-6">
      <div className="flex items-center overflow-hidden text-ellipsis">
        <TypingDots className="ml-[9px]" />
        <span className="min-w-0 truncate ml-1">
          <strong>
            {usersTyping.map((users) => users.displayName).join(", ")}
          </strong>{" "}
          is typing...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
