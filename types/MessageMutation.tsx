import { CreateMessageVariables } from "@/lib/services/mutations";
import { MutationState } from "@tanstack/react-query";

export interface MessageMutation extends MutationState {
  variables: CreateMessageVariables;
}
