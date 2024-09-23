import { TextOrVoiceChannel } from "@/types/server";
import { EditPen, Hash } from "../svgs";
import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import { cn } from "@/lib/utils";
import MessageList from "../message/item/MessageList";
import { FetchNextPageType } from "@/types/tanstack-query";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";

type ChannelMainChatProps = {
  channel: TextOrVoiceChannel;
  user: UserType;
  messages: MessageType[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: FetchNextPageType;
};

const ChannelMainChat = ({
  channel,
  user,
  messages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: ChannelMainChatProps) => {
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const firstMessageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: firstMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      if (hasNextPage) fetchNextPage();
    }
  }, [entry]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;

      setIsReadyToShow(true);
    }
  }, []);

  return (
    <div
      className="flex flex-col grow bg-background-primary overflow-y-scroll overflow-x-hidden"
      aria-label={`${channel.name} (channel)`}
      ref={scrollerRef}
      style={{ visibility: isReadyToShow ? "visible" : "hidden" }}
    >
      <ol
        className={cn("mb-4", {
          "mb-[30px]": messages.length > 0,
        })}
        aria-label={`Messages in ${channel.name}`}
      >
        <div className="flex flex-col justify-end m-4">
          <div className="flex items-center justify-center w-[68px] h-[68px] mt-4 rounded-full bg-background-accent">
            <Hash className="w-[42px] h-[42px]" />
          </div>

          <h3 className="font-semibold leading-10 my-2 text-[32px] text-header-primary">
            Welcome to #{channel.name}!
          </h3>

          <p className="text-header-secondary text-md leading-5">
            This is the start of the #{channel.name} channel.
          </p>

          <div className="mt-2">
            <button className="border-0 text-text-link mr-2 p-1.5 rounded flex-nowrap flex items-center hover:bg-background-modifier-hover">
              <div className="mr-1.5">
                <EditPen />
              </div>

              <p className="text-md leading-5">Edit Channel</p>
            </button>
          </div>
        </div>

        <div ref={ref} id="container-intersection" />
        {isFetchingNextPage ? "Loading messages..." : null}
        <MessageList user={user} messages={messages} />
      </ol>
    </div>
  );
};

export default ChannelMainChat;
