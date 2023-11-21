"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "../dbConnect";
import { registerSchema } from "../validations/register";

export async function register(formData: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(formData);
  if (!validatedFields.success) return;

  const { email, password, username, displayName } = validatedFields.data;
  await dbConnect();
  const existingEmail = await User.findOne({
    email: { $regex: email, $options: "i" },
  });

  if (existingEmail) {
    throw new Error("Email is already registered");
  }

  const existingUsername = await User.findOne({
    username: { $regex: username, $options: "i" },
  });

  if (existingUsername)
    throw new Error(
      "Username is unavailable. Try adding numbers, letters, underscores _ , or periods."
    );

  try {
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      email,
      password: hashedPassword,
      username,
      avatar: "/images/profile-pictures/blurple.png",
      displayName: displayName || username,
    });

    await user.save();
  } catch (err) {
    console.error((err as Error)?.message);
  }
}
