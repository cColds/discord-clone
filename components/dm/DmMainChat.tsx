"use client";

import { MessageType } from "@/types/message";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";

import MessageList from "../message/item/MessageList";

import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { FetchNextPageType } from "@/types/tanstack-query";

type DmMainChatProps = {
  messages: MessageType[];
  scrollerRef: React.RefObject<HTMLDivElement>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: FetchNextPageType;
};

export default function DmMainChat({
  messages,
  scrollerRef,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
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

  return (
    <ol className="mb-[30px] min-h-[150px] overflow-hidden">
      <div ref={ref} id="container-intersection" />
      {isFetchingNextPage ? "Loading messages..." : null}
      <MessageList messages={messages} user={user} />
    </ol>
  );
}
