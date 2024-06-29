import { z } from "zod";

export const createChannelSchema = z.object({
  channelType: z.string(),
  channelName: z
    .string()
    .min(1, { message: "Must be between 1 and 100 in length." })
    .max(100, { message: "Must be between 1 and 100 in length." }),
});
