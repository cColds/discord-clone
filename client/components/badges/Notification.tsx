import { cn } from "@/lib/utils";

type NotficationProps = {
  incomingRequests: number;
  className?: string;
};

export default function Notification({
  incomingRequests,
  className,
}: NotficationProps) {
  return (
    <div
      className={cn(
        "bg-status-danger w-4 min-w-[16px] min-h-[16px] rounded-lg font-bold leading-4 tracking-[.02em] text-white text-xs text-center",
        className
      )}
    >
      {incomingRequests}
    </div>
  );
}
