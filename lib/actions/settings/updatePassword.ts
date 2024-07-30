"use server";

import dbConnect from "@/lib/db/dbConnect";
import { changePasswordSchema } from "@/lib/validations/changePassword";
import User from "@/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const updatePassword = async (
  formData: z.infer<typeof changePasswordSchema>,
  userId: string
) => {
  try {
    const validatedFields = changePasswordSchema.safeParse(formData);
    if (!validatedFields.success || !userId) return;
    const { password, newPassword } = validatedFields.data;

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) throw new Error("User does not exist.");

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch)
      return {
        error: { msg: "Password does not match.", field: "password" },
      };

    const hashedPassword = await bcrypt.hash(newPassword, 8);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });
  } catch (err) {
    console.error(err);
  }
};
