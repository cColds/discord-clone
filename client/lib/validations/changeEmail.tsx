import { z } from "zod";

export const changeEmailSchema = z.object({
  email: z.string().email("Not a well formed email address."),
  password: z.string(),
});
