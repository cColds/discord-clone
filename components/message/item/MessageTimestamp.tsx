import ActionTooltip from "@/components/tooltip/ActionTooltip";
import { format } from "date-fns";

type MessageTimestampProps = {
  formattedDate: string;
  dateTime: string;
  ariaLabel?: string;
};

export default function MessageTimestamp({
  formattedDate,
  dateTime,
  ariaLabel,
}: MessageTimestampProps) {
  return (
    <ActionTooltip
      content={format(dateTime, "EEEE, LLLL d h:mm a")}
      delayDuration={500}
    >
      <time
        dateTime={dateTime}
        className="text-xs leading-[1.375rem] text-text-muted ml-[0.25rem] overflow-hidden"
        aria-label={ariaLabel}
      >
        {formattedDate}
      </time>
    </ActionTooltip>
  );
}
