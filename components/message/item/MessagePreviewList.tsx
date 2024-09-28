import { MessageMutation } from "@/types/MessageMutation";
import { UserNormal, UserType } from "@/types/user";
import { useMutationState } from "@tanstack/react-query";
import MessageItem from "./MessageItem";
import {
  differenceInMinutes,
  format,
  formatRelative,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns";
import { MessageType } from "@/types/message";

type MessagePreviewListProps = {
  user: UserType;
  prevMessage: MessageType | null;
};

function MessagePreviewList({ user, prevMessage }: MessagePreviewListProps) {
  const messagesMutation = useMutationState({
    filters: { mutationKey: ["messages", "create-message"], status: "pending" },
    select: (mutation) => mutation.state as MessageMutation,
  });

  return messagesMutation.map((mutation) => {
    const { channelId, formData } = mutation.variables;

    const date = new Date().toString();
    const formattedDate = format(date, "MM/dd/yyyy h:mm a");

    const files = formData.getAll("file[]");
    const formattedRelative = formatRelative(date, new Date());

    const isTodayOrYesterday = isToday(date) || isYesterday(date);
    const formatted = isTodayOrYesterday
      ? formattedRelative.charAt(0).toUpperCase() + formattedRelative.slice(1)
      : formattedDate;

    const userNormal: UserNormal = {
      id: user.id,
      _id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const message = {
      _id: mutation.submittedAt.toString(),
      message: formData.get("message")?.toString() || "",
      channelId,
      createdAt: date,
      updatedAt: date,
      readBy: [],
      images: [],
      previewImages: files,
      sender: userNormal,
      pending: true,
    };

    let showDateDivider = false;
    let shouldMergeMessages = false;

    if (!prevMessage) {
      showDateDivider = true;
    } else {
      const sameDay = isSameDay(date, prevMessage.createdAt);

      shouldMergeMessages =
        differenceInMinutes(date, prevMessage.createdAt) <= 7 &&
        userNormal.id === prevMessage.sender._id &&
        sameDay;

      showDateDivider = !sameDay;
    }

    return (
      <MessageItem
        msg={message}
        editedDate={""}
        showDateDivider={showDateDivider}
        shouldMergeMessages={shouldMergeMessages}
        formatted={formatted}
        key={mutation.submittedAt}
        isEditActive={false}
        onEditToggle={() => {}}
        editMessageId={null}
        isYourMessage={true}
      />
    );
  });
}

export default MessagePreviewList;
