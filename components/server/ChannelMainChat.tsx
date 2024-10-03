import { TextOrVoiceChannel } from "@/types/server";
import { EditPen, Hash } from "../svgs";
import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import { cn } from "@/lib/utils";
import MessageList from "../message/item/MessageList";
import { FetchNextPageType } from "@/types/tanstack-query";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { useMutationState } from "@tanstack/react-query";
import { MessageMutation } from "@/types/MessageMutation";
import Spinner from "../spinners/Spinner";

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
  const scrollerRef = useRef<HTMLDivElement>(null);

  const messagesMutation = useMutationState({
    filters: { mutationKey: ["messages", "create-message"], status: "pending" },
    select: (mutation) => mutation.state as MessageMutation,
  });
  const messagesMutationSuccess = useMutationState({
    filters: { mutationKey: ["messages", "create-message"], status: "success" },
    select: (mutation) => mutation.state as MessageMutation,
  });

  const { ref, entry } = useIntersection({
    root: scrollerRef.current,
    threshold: 1,
  });
  const scrollPositionRef = useRef({
    previousScrollHeight: 0,
    previousScrollTop: 0,
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
  }, [entry]); // Fetch next page and track scroll position

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;

      setIsReadyToShow(true);
    }
  }, []); // Scrolls to bottom on initial load

  useEffect(() => {
    if (messagesMutation.length > 0 && scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messagesMutation]); // Autoscroll on message change (might break on edit msg)

  useEffect(() => {
    const lastMessage =
      messagesMutationSuccess[messagesMutationSuccess.length - 1];

    const lastMessageFormData = lastMessage?.variables.formData;

    const lastMessageContainsImage = !!lastMessageFormData?.get("file[]");

    if (lastMessageContainsImage && scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messagesMutationSuccess]);

  useEffect(() => {
    const container = scrollerRef.current;
    if (isFetchingNextPage || !container) return;

    const { previousScrollHeight, previousScrollTop } =
      scrollPositionRef.current;

    const heightDifference = container.scrollHeight - previousScrollHeight;
    container.scrollTop = previousScrollTop + heightDifference;
  }, [isFetchingNextPage]); // Update scroll height to calculated previous height before messages fetched (so you are at the bottom of the new messages)

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
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 pl-5">
            <Spinner /> <p className="opacity-80">Loading...</p>
          </div>
        ) : null}
        <MessageList user={user} messages={messages} />
      </ol>
    </div>
  );
};

export default ChannelMainChat;
