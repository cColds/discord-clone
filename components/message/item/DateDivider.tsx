"use client";

import { format } from "date-fns";

const DateDivider = ({ date }: { date: string }) => {
  const formattedMonthDayYear = format(date, "LLLL d, y");

  return (
    <div className="ml-[1rem] mr-[0.875rem] mt-[1.5rem] mb-[0.5rem] flex justify-center items-center border-t border-background-modifier-accent h-0 pointer-events-none select-none">
      <span className="px-1 py-0.5 text-text-muted text-xs leading-[13px] -mt-[1px] font-semibold rounded-lg bg-background-primary">
        {formattedMonthDayYear}
      </span>
    </div>
  );
};

export default DateDivider;
