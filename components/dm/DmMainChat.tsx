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
      queryFn: ({ pageParam }) => getMessages(channelId, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length) return allPages.length;
      },
      initialData: { pages: [messages], pageParams: [0] },
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
    const container = scrollerRef.current;
    if (isFetchingNextPage || !container) return;

    const { previousScrollHeight, previousScrollTop } =
      scrollPositionRef.current;

    const heightDifference = container.scrollHeight - previousScrollHeight;
    container.scrollTop = previousScrollTop + heightDifference;
  }, [isFetchingNextPage]);

  const flatPageMessages = data.pages.toReversed().flatMap((page) => page);

  return (
    <ol className="mb-[30px] min-h-[150px] overflow-hidden">
      <div ref={ref} id="container-intersection" />
      {isFetchingNextPage ? "Loading messages..." : null}
      <MessageList messages={flatPageMessages} user={user} />
    </ol>
  );
}
