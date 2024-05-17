import { z } from "zod";

const errorMessage = "Must be between 2 and 100 in length.";

const MAX_FILE_SIZE_IN_BYTES = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const createServerSchema = z.object({
  serverName: z
    .string()
    .min(2, { message: errorMessage })
    .max(100, { message: errorMessage }),
  icon: z
    .custom<File>()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE_IN_BYTES,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png, .gif and .webp formats are supported."
    )
    .optional(),
});
