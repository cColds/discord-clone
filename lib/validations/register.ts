import { USERNAME_REGEX } from "@/constants";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Not a well formed email address."),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" }),

  username: z
    .string()
    .regex(USERNAME_REGEX, {
      message: "Please only use numbers, letters, underscores _ , or periods.",
    })
    .refine((val) => val.length >= 2 && val.length <= 32, {
      message: "This must be 2-32 characters.",
    }),
});
