import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1)
    .max(500, { message: "Max message length is 5000" }),
  images: z.any(),
});
