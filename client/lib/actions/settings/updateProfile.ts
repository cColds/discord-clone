"use server";

import dbConnect from "@/lib/db/dbConnect";
import { uploadFileToCloudinary } from "@/lib/db/uploadFileToCloudinary";
import { userProfileSchema } from "@/lib/validations/userProfile";
import User from "@/models/User";
import { UserType } from "@/types/user";

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
      iconUrl = await uploadFileToCloudinary(formData);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        displayName,
        avatar:
          iconUrl ||
          (defaultAvatar && "/images/profile-pictures/blurple.png") ||
          user.avatar,
      },
      { new: true }
    );

    const serializedUser = JSON.parse(JSON.stringify(updatedUser)) as UserType;

    return serializedUser;
  } catch (err) {
    console.error(err);
  }
};
