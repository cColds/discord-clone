import { cn } from "@/lib/utils";

type DmButtonType = {
  text: string;
  className?: string;
  disabled?: boolean;
};

export default function DmButton({
  text,
  className,
  disabled = false,
}: DmButtonType) {
  return (
    <button
      className={cn(
        "mr-2 py-0.5 px-4 rounded-[3px] text-sm leading-4 h-6 min-w-[24px] min-h-[24px] border-0 transition ease-in-out duration-200 truncate",
        className
      )}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
