import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../actions/sendMessage";
import { editMessage } from "../db/editMessage";

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

    onError: () => {
      console.log("error creating msg");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    mutationKey: ["messages"],
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

    onError: () => {
      console.error("Error editing message");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
      console.log("Successfully edited message");
    },
    mutationKey: ["messages"],
  });
};
