import { z } from "zod";

const errorMessage = "You didn't enter the server name correctly";

export const deleteServerSchema = z.object({
  serverName: z
    .string()
    .min(2, { message: errorMessage })
    .max(100, { message: errorMessage }),
});
