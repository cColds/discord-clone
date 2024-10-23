import { z } from "zod";

export const editChannelSchema = z.object({
  channelName: z
    .string()
    .min(1, { message: "Must be between 1 and 100 in length." })
    .max(100, { message: "Must be between 1 and 100 in length." }),
});
