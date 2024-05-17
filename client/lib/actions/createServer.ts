"use server";

import { createServerSchema } from "@/lib/validations/createServer";
import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";
import { uploadFileToCloudinary } from "@/lib/db/uploadFileToCloudinary";

export async function createServer(formData: FormData) {
  const data = {
    serverName: formData.get("serverName"),
    icon: formData.get("file") || undefined,
  };

  const validatedFields = createServerSchema.safeParse(data);
  console.log("success: ", validatedFields.success);

  if (!validatedFields.success) return;

  await dbConnect();

  const { serverName, icon } = validatedFields.data;
  try {
    let iconUrl = "";
    if (icon) {
      iconUrl = await uploadFileToCloudinary(formData);
    }

    const server = new Server({ serverName, icon: iconUrl || undefined });
    await server.save();
  } catch (err) {
    console.error(err);
    throw new Error("Server creation failed due to database error");
  }
}
