import { z } from "zod";

export const joinServerSchema = z.object({
  invite: z
    .string()
    .min(1, { message: "Please enter a valid invite link or invite code" }),
});
