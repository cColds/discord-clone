import { Edit, Menu, Reaction, Reply } from "../svgs";
import ActionTooltip from "./ActionTooltip";

type MessageActionButtonType = {
  content: string;
  children: React.ReactNode;
};

const MessageActionButton = ({
  content,
  children,
}: MessageActionButtonType) => {
  return (
    <ActionTooltip content={content}>
      <button
        className="flex items-center justify-center min-w-[24px] min-h-[24px] h-6 p-1 text-interactive-normal hover:text-interactive-hover hover:bg-background-modifier-hover cursor-pointer box-content"
        aria-label={content}
      >
        {children}
      </button>
    </ActionTooltip>
  );
};

type MessageActionsType = {
  isYourMessage: boolean;
};

const MessageActions = ({ isYourMessage }: MessageActionsType) => {
  return (
    <div className="absolute top-0 right-0">
      <div
        className="-top-4 absolute right-0 pl-3.5 pr-8 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
        role="group"
      >
        <div className="grid grid-flow-col bg-background-primary shadow-elevation-low h-8 select-none duration-100 relative">
          <MessageActionButton content="Add Reaction">
            <Reaction className="w-5 h-5" />
          </MessageActionButton>

          {!isYourMessage && (
            <MessageActionButton content="Reply">
              <Reply className="w-5 h-5" />
            </MessageActionButton>
          )}

          {isYourMessage && (
            <MessageActionButton content="Edit">
              <Edit className="w-5 h-5" />
            </MessageActionButton>
          )}

          <MessageActionButton content="More">
            <Menu className="w-5 h-5" />
          </MessageActionButton>
        </div>
      </div>
    </div>
  );
};

export default MessageActions;
