"use server";

import dbConnect from "@/lib/db/dbConnect";
import { serverSchema } from "@/lib/validations/serverSchema";
import Server from "@/models/Server";
import { Types } from "mongoose";
import { uploadFileToCloudinary } from "@/lib/db/uploadFileToCloudinary";
import { revalidatePath } from "next/cache";

type updateServerProps = {
  formData: FormData;
  userId: string;
  serverId: string;
};

export const updateServer = async ({
  formData,
  userId,
  serverId,
}: updateServerProps) => {
  const data = {
    serverName: formData.get("serverName"),
    icon: formData.get("file") || undefined,
  };

  const validatedFields = serverSchema.safeParse(data);

  if (!validatedFields.success) return;

  await dbConnect();

  const { serverName, icon } = validatedFields.data;

  const server = await Server.findById(serverId);

  const userObjectId = new Types.ObjectId(userId);

  if (!userObjectId.equals(server?.owner)) return;

  let iconUrl;
  if (icon) {
    iconUrl = await uploadFileToCloudinary(formData);
  }

  const removeOrUpdateIcon = iconUrl
    ? { icon: iconUrl }
    : { $unset: { icon: 1 } };

  await Server.findByIdAndUpdate(
    serverId,
    { serverName, ...removeOrUpdateIcon },
    { new: true }
  );
};
