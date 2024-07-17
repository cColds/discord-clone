import { cn } from "@/lib/utils";

type PrimaryButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
};

const PrimaryButton = ({
  onClick,
  children,
  className,
  type = "button",
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "truncate px-4 py-2 h-8 min-w-[60px] text-sm leading-4 min-h-[32px] text-white border-0 bg-brand-500 hover:bg-brand-560 active:bg-brand-600",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;