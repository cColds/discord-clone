import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Not a well formed email address."),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" }),
});
