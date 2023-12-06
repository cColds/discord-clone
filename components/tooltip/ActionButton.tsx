import { cn } from "@/lib/utils";
import ActionTooltip from "./ActionTooltip";
import { forwardRef } from "react";

type ActionButtonProps = {
  children: React.ReactNode;
  name: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, className, name, ...props }, ref) => {
    return (
      <ActionTooltip content={name}>
        <button
          ref={ref}
          className={cn(
            "flex justify-center items-center text-interactive-normal hover:text-interactive-hover bg-background-secondary rounded-full w-9 h-9 group-hover:bg-background-tertiary",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </ActionTooltip>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
