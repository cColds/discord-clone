import { cn } from "@/lib/utils";
import ActionTooltip from "./ActionTooltip";

type ActionButtonProps = {
  children: React.ReactNode;
  name: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

// TODO: fix forwardRef error (still not sure which component causing it)

const ActionButton = ({
  children,
  className,
  name,
  ...props
}: ActionButtonProps) => {
  return (
    <ActionTooltip content={name}>
      <button
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
};

export default ActionButton;
