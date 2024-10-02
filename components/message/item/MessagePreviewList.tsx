import { MessageMutation } from "@/types/MessageMutation";
import { UserNormal, UserType } from "@/types/user";
import { useMutationState } from "@tanstack/react-query";
import MessageItem from "./MessageItem";
import { differenceInMinutes, isSameDay } from "date-fns";
import { MessageType } from "@/types/message";
import { formatMessageDate } from "@/utils/helpers/formatMessageDate";

type MessagePreviewListProps = {
  user: UserType;
  prevMessage: MessageType | null;
};

type MessagePreview = MessageType & {
  previewImages: FormDataEntryValue[];
  pending: boolean;
};

function MessagePreviewList({ user, prevMessage }: MessagePreviewListProps) {
  const messagesMutation = useMutationState({
    filters: { mutationKey: ["messages", "create-message"], status: "pending" },
    select: (mutation) => mutation.state as MessageMutation,
  });

  return messagesMutation.map((mutation) => {
    const { channelId, formData } = mutation.variables;

    const date = new Date();
    const dateString = date.toString();

    const files = formData.getAll("file[]");
    const formatted = formatMessageDate(date);

    const userNormal: UserNormal = { ...user, _id: user.id };

    const message: MessagePreview = {
      _id: mutation.submittedAt.toString(),
      message: formData.get("message")?.toString() || "",
      channelId,
      createdAt: dateString,
      updatedAt: dateString,
      readBy: [],
      images: [],
      previewImages: files,
      sender: userNormal,
      pending: true,
      type: "user",
    };

    const sameDay =
      !!prevMessage && isSameDay(dateString, prevMessage.createdAt);
    const isWithinTimeRange =
      sameDay && differenceInMinutes(dateString, prevMessage.createdAt) <= 7;

    const shouldMergeMessages =
      isWithinTimeRange && userNormal._id === prevMessage.sender._id;

    return (
      <MessageItem
        msg={message}
        editedDate={""}
        showDateDivider={!prevMessage || !sameDay}
        shouldMergeMessages={shouldMergeMessages}
        formatted={formatted}
        key={mutation.submittedAt}
        isEditActive={false}
        onEditToggle={() => {}}
        editMessageId={null}
        isYourMessage={true}
        prevMessage={null}
      />
    );
  });
}

export default MessagePreviewList;
