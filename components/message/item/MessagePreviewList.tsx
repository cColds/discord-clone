import { CreateMessageVariables } from "@/lib/services/mutations";
import { MutationState, useMutationState } from "@tanstack/react-query";

interface MessageMutationState extends MutationState {
  variables: CreateMessageVariables;
}

function MessagePreviewList() {
  const messagesMutation = useMutationState({
    filters: { mutationKey: ["messages"], status: "pending" },
    select: (mutation) => mutation.state as MessageMutationState,
  });

  return messagesMutation
    .filter((messageMutation) => messageMutation?.status === "pending")
    .map((mutation) => {
      const message =
        mutation.variables.formData.get("message")?.toString() || "Placeholder";

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
