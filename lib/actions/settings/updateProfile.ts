"use server";

import dbConnect from "@/lib/db/dbConnect";
import { uploadToCloudinary } from "@/lib/db/uploadToCloudinary";
import { userProfileSchema } from "@/lib/validations/userProfile";
import User from "@/models/User";
import { UserType } from "@/types/user";
import { getRandomProfilePic } from "@/utils/helpers/getRandomProfilePic";

export const updateProfile = async (
  formData: FormData,
  userId: string,
  defaultAvatar: boolean
) => {
  const data = {
    displayName: formData.get("displayName"),
    avatar: formData.get("file") || null,
  };

  const validatedFields = userProfileSchema.safeParse(data);

  if (!validatedFields.success || !userId) return;
  const { displayName, avatar } = validatedFields.data;

  await dbConnect();

  const user = await User.findById(userId);

  if (!user) throw new Error("User does not exist.");

  try {
    let iconUrl = "";

    if (avatar) {
      const transformation = [
        { width: 250, height: 250, crop: "fill", gravity: "center" },
      ];

      const buffer = await avatar.arrayBuffer();
      const base64Img = Buffer.from(buffer).toString("base64");
      const res = await uploadToCloudinary(
        `data:${avatar.type};base64,${base64Img}`,
        avatar.name,
        transformation
      );

      if (res.success && res.result) {
        iconUrl = res.result.secure_url;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        displayName,
        avatar:
          iconUrl || (defaultAvatar && getRandomProfilePic()) || user.avatar,
      },
      { new: true }
    );

    const serializedUser = JSON.parse(JSON.stringify(updatedUser)) as UserType;

    return serializedUser;
  } catch (err) {
    console.error(err);
  }
};
