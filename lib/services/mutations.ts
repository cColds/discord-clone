import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../actions/sendMessage";

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
