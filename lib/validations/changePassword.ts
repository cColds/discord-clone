import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z.string(),
    newPassword: z.string().min(8, { message: "Must be 8 or more in length." }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match!",
    path: ["confirmNewPassword"],
  });
