"use server";

import dbConnect from "@/lib/db/dbConnect";
import { changeUsernameSchema } from "@/lib/validations/changeUsername";
import User from "@/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const updateUsername = async (
  formData: z.infer<typeof changeUsernameSchema>,
  userId: string
) => {
  try {
    const validatedFields = changeUsernameSchema.safeParse(formData);
    if (!validatedFields.success || !userId) return;

    const { username, password } = validatedFields.data;
    await dbConnect();

    const usernameTaken = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    }).lean();

    if (usernameTaken)
      return {
        error: {
          msg: "Username is unavailable. Try adding numbers, letters, underscores _, or periods.",
          field: "username",
        },
      };

    const user = await User.findById(userId);

    if (!user) throw new Error("User does not exist.");

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch)
      return { error: { msg: "Password does not match.", field: "password" } };

    await User.findByIdAndUpdate(userId, { username: username }, { new: true });
  } catch (err) {
    console.error(err);
  }
};
