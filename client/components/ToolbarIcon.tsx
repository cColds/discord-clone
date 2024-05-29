import { cn } from "@/lib/utils";
import ActionTooltip from "./tooltip/ActionTooltip";

type ToolbarIconProps = {
  children: React.ReactNode;
  name: string;
  className?: string;
};

const ToolbarIcon = ({ children, name, className }: ToolbarIconProps) => {
  return (
    <ActionTooltip content={name} side="bottom">
      <button
        aria-label={name}
        className={cn(
          "text-interactive-normal hover:text-interactive-hover mx-2 border-0",
          className
        )}
      >
        {children}
      </button>
    </ActionTooltip>
  );
};

export default ToolbarIcon;
