import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../db/getMessages";

export const useGetMessages = (channelId: string) => {
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => getMessages(channelId),
  });
};
