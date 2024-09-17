"use client";

import { MessageType } from "@/types/message";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";

import MessageList from "../message/item/MessageList";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "@/lib/db/getMessages";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";

type DmMainChatProps = {
  messages: MessageType[];
  channelId: string;
  scrollerRef: React.RefObject<HTMLDivElement>;
};

export default function DmMainChat({
  channelId,
  messages,
  scrollerRef,
}: DmMainChatProps) {
  const { user } = useUser();
  if (!user) redirect("/");

  const fetchMessages = async ({ pageParam }: { pageParam: number }) => {
    const updatedMessages = await getMessages(channelId, pageParam);

    return updatedMessages;
  };

  const firstMessageRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef({
    previousScrollHeight: 0,
    previousScrollTop: 0,
  });

  const { ref, entry } = useIntersection({
    root: firstMessageRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["messages", channelId],
      queryFn: fetchMessages,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.length) return;

        return allPages.length + 1;
      },
      initialData: {
        pages: [messages],
        pageParams: [0],
      },
    });

  useEffect(() => {
    if (entry?.isIntersecting) {
      const container = scrollerRef.current;

      if (container) {
        scrollPositionRef.current.previousScrollHeight = container.scrollHeight;
        scrollPositionRef.current.previousScrollTop = container.scrollTop;
      }

      if (hasNextPage) fetchNextPage();
    }
  }, [entry]);

  useEffect(() => {
    if (isFetchingNextPage === false) {
      const container = scrollerRef.current;
      if (container) {
        const newScrollHeight = container.scrollHeight;

        const heightDifference =
          newScrollHeight - scrollPositionRef.current.previousScrollHeight;

        container.scrollTop =
          scrollPositionRef.current.previousScrollTop + heightDifference;
      }
    }
  }, [isFetchingNextPage]);

  const flatPageMessages = data.pages.toReversed().flatMap((page) => page);

  return (
    <ol className="mb-[30px] min-h-[150px] overflow-hidden">
      <div ref={ref} id="container-intersection"></div>
      {isFetchingNextPage ? "Loading messages..." : null}
      <MessageList messages={flatPageMessages} user={user} />
    </ol>
  );
}
