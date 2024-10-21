import { z } from "zod";

export const addFriendSchema = z.object({
  recipientUsername: z.string(),
});
