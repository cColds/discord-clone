"use server";

import { z } from "zod";
import { createServerSchema } from "@/lib/validations/createServer";
import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";

export async function createServer(
  formData: z.infer<typeof createServerSchema>
) {
  const validatedFields = createServerSchema.safeParse(formData);
  console.log("success: ", validatedFields.success);
  if (!validatedFields.success) return;

  await dbConnect();

  const { serverName } = validatedFields.data;
  try {
    const server = new Server({ serverName });
    await server.save();
  } catch (err) {
    console.error(err);
    throw new Error("Server creation failed due to database error");
  }
}
