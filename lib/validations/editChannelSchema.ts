import { z } from "zod";

export const editChannelSchema = z.object({
  channelName: z
    .string()
    .min(1, { message: "Must be between 1 and 100 in length." })
    .max(100, { message: "Must be between 1 and 100 in length." })
    .transform((val) =>
      val
        .replace(/[ -]+/g, "-")
        .replace(/[~`!@#$%^&*()+=\[\]{}|\\:;'",.<>?/]/g, "")
        .replace(/^[ -]+/, "") // remove leading spaces or hyphens
        .replace(/-+$/, "") // remove trailing hyphen or space
        .toLowerCase()
    ),
});
