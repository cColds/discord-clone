import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE_IN_BYTES = 5_000_000;

export const userProfileSchema = z.object({
  displayName: z
    .string()
    .max(32, { message: "Must be 32 characters or fewer in length." }),
  avatar: z
    .custom<File>()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE_IN_BYTES,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png, .gif and .webp formats are supported."
    )
    .or(z.literal(null)),
});
