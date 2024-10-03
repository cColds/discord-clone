import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../actions/sendMessage";
import { editMessage } from "../db/editMessage";
import { deleteMessage } from "../db/deleteMessage";

export type CreateMessageVariables = {
  sender: string;
  formData: FormData;
  channelId: string;
  type: "dm" | "server";
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (v: CreateMessageVariables) =>
      sendMessage(v.sender, v.formData, v.channelId, v.type),

    onMutate: (newMessage) => {
      console.log("Mutated new message successfully!", newMessage);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    mutationKey: ["messages", "create-message"],
  });
};

export type EditMessageVariables = {
  messageId: string;
  updatedMessage: string;
};

export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (v: EditMessageVariables) =>
      editMessage(v.messageId, v.updatedMessage),

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    mutationKey: ["messages"],
  });
};

export type DeleteMessageVariables = {
  messageId: string;
  userId: string;
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (v: DeleteMessageVariables) =>
      deleteMessage(v.userId, v.messageId),
    onError: () => {
      console.error("Error deleting message");
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    mutationKey: ["messages"],
  });
};
