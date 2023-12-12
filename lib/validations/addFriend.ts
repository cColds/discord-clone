import { z } from "zod";

export const addFriendSchema = z.object({
  friendUsername: z.string(),
});
