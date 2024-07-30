"use server";

import dbConnect from "@/lib/db/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { changeEmailSchema } from "@/lib/validations/changeEmail";

export const updateEmail = async (
  formData: z.infer<typeof changeEmailSchema>,
  userId: string
) => {
  try {
    const validatedFields = changeEmailSchema.safeParse(formData);
    if (!validatedFields.success || !userId) return;

    const { email, password } = validatedFields.data;
    await dbConnect();

    const emailExists = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (emailExists)
      return {
        error: { msg: "Email is already registered.", field: "email" },
      };

    const user = await User.findById(userId);

    if (!user) throw new Error("User does not exist.");

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch)
      return {
        error: { msg: "Password does not match.", field: "password" },
      };

    const updatedEmail = await User.findByIdAndUpdate(
      userId,
      { email },
      { new: true }
    );
    console.log(updatedEmail);
  } catch (err) {
    console.error(err);
  }
};
