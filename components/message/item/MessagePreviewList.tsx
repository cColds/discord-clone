import { MessageMutation } from "@/types/MessageMutation";
import { useMutationState } from "@tanstack/react-query";

function MessagePreviewList() {
  const messagesMutation = useMutationState({
    filters: { mutationKey: ["messages"], status: "pending" },
    select: (mutation) => mutation.state as MessageMutation,
  });

  return messagesMutation
    .filter((messageMutation) => messageMutation?.status === "pending")
    .map((mutation) => {
      let message = "";

      if ("formData" in mutation.variables) {
        message = mutation.variables.formData.get("message")?.toString() || "";
      }

      if (!message) return null;

      return (
        <li
          className="opacity-50 py-0.5 pl-[72px] pr-[48px] hover:bg-background-message-hover group m-0 min-h-[1.375rem]"
          key={mutation.submittedAt}
        >
          {message}
        </li>
      );
    });
}

export default MessagePreviewList;
