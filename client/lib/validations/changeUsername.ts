import { USERNAME_REGEX } from "@/utils/constants/usernameRegex";
import { z } from "zod";

export const changeUsernameSchema = z.object({
  username: z
    .string()
    .regex(USERNAME_REGEX, {
      message: "Please only use numbers, letters, underscores _ , or periods.",
    })
    .refine((val) => val.length >= 2 && val.length <= 32, {
      message: "Must be between 2 and 32 in length.",
    }),
  password: z.string(),
});
