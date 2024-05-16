import { z } from "zod";

const errorMessage = "Must be between 2 and 100 in length.";

export const createServerSchema = z.object({
  serverName: z
    .string()
    .min(2, { message: errorMessage })
    .max(100, { message: errorMessage }),
});
