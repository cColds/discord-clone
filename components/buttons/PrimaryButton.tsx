import { cn } from "@/lib/utils";
import React from "react";

type PrimaryButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
};

const PrimaryButton = React.forwardRef((props: PrimaryButtonProps, ref) => {
  return (
    <button
      type={props.type}
      className={cn(
        "shrink-0 truncate px-4 py-2 h-8 min-w-[60px] text-sm leading-4 min-h-[32px] text-white border-0 bg-brand-500 hover:bg-brand-560 active:bg-brand-600",
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
});

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
