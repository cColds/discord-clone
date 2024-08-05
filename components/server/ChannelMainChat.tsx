import { TextOrVoiceChannel } from "@/types/server";
import { EditPen, Hash } from "../svgs";
import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import {
  differenceInMinutes,
  format,
  formatRelative,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns";
import MessageItem from "../message/MessageItem";
import { cn } from "@/lib/utils";

type ChannelMainChatProps = {
  channel: TextOrVoiceChannel;
  user: UserType;
  messages: MessageType[];
};

type MessagesProps = {
  messages: MessageType[];
  user: UserType;
};

const Messages = ({ messages, user }: MessagesProps) => {
  let prevMessage: null | MessageType = null;

  return (
    <>
      {messages.map((msg) => {
        const formattedDate = format(msg.createdAt, "MM/dd/yyyy h:mm a");
        const formattedRelative = formatRelative(msg.createdAt, new Date());

        const isTodayOrYesterday =
          isToday(msg.createdAt) || isYesterday(msg.createdAt);

        const formatted = isTodayOrYesterday
          ? formattedRelative.charAt(0).toUpperCase() +
            formattedRelative.slice(1)
          : formattedDate;

        const editedDate = format(
          msg.edited || msg.updatedAt,
          "EEEE, LLLL d h:mm a"
        );

        let showDateDivider = false;
        let shouldMergeMessages = false;

        if (!prevMessage) {
          showDateDivider = true;
        } else {
          const sameDay = isSameDay(msg.createdAt, prevMessage.createdAt);

          shouldMergeMessages =
            differenceInMinutes(msg.createdAt, prevMessage.createdAt) <= 7 &&
            msg.sender._id === prevMessage.sender._id &&
            sameDay;

          showDateDivider = !sameDay;
        }

        prevMessage = msg;

        return (
          <MessageItem
            msg={msg}
            user={user}
            editedDate={editedDate}
            showDateDivider={showDateDivider}
            shouldMergeMessages={shouldMergeMessages}
            formatted={formatted}
            key={msg._id}
          />
        );
      })}
    </>
  );
};

const ChannelMainChat = ({ channel, user, messages }: ChannelMainChatProps) => {
  return (
    <div
      className="flex flex-col grow bg-background-primary overflow-y-scroll overflow-x-hidden"
      aria-label={`${channel.name} (channel)`}
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

        <Messages user={user} messages={messages} />
      </ol>
    </div>
  );
};

export default ChannelMainChat;
