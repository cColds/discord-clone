import { format, formatRelative, isToday, isYesterday } from "date-fns";

export const formatMessageDate = (date: Date) => {
  const formattedDate = format(date, "MM/dd/yyyy h:mm a");
  const formattedRelative = formatRelative(date, new Date());

  return isToday(date) || isYesterday(date)
    ? formattedRelative.charAt(0).toUpperCase() + formattedRelative.slice(1)
    : formattedDate;
};
