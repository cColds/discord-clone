"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import User, { UserDM } from "@/models/User";
import dbConnect from "../db/dbConnect";
import { registerSchema } from "../validations/register";
import mongoose from "mongoose";
import Server from "@/models/Server";
import Dm from "@/models/Dm";
import Message from "@/models/Message";
import { getRandomWelcomeMessage } from "@/utils/helpers/getRandomWelcomeMessage";

export async function register(formData: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(formData);
  if (!validatedFields.success) return;

  const { email, password, username, displayName } = validatedFields.data;
  await dbConnect();
  const existingEmail = await User.findOne({
    email: { $regex: `^${email}$`, $options: "i" },
  });

  if (existingEmail) {
    throw new Error("Email is already registered");
  }

  const existingUsername = await User.findOne({
    username: { $regex: `^${username}$`, $options: "i" },
  });

  if (existingUsername)
    throw new Error(
      "Username is unavailable. Try adding numbers, letters, underscores _ , or periods."
    );

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const [hashedPassword, defaultServer, defaultFriend] = await Promise.all([
        bcrypt.hash(password, 8),
        Server.findById("670c72695cd0c32d6f6f2909"),
        User.findById("670c70295cd0c32d6f6f28f7"),
      ]);

      const user = new User({
        email,
        password: hashedPassword,
        username,
        avatar: "/images/profile-pictures/blurple.png",
        displayName: displayName || username,
        servers: defaultServer ? [defaultServer._id] : [],
        social: { friends: defaultFriend ? [defaultFriend._id] : [] },
      });

      let welcomeMessageDoc;
      if (defaultServer) {
        defaultServer.members.push(user._id);

        welcomeMessageDoc = new Message({
          sender: user,
          message: getRandomWelcomeMessage(),
          channelId: defaultServer.categories[0].channels[0]._id,
          images: [],
          readBy: [],
          type: "system",
        });
      }
      let dm;
      if (defaultFriend) {
        dm = new Dm({
          members: [user._id, defaultFriend._id],
          lastMessageTimestamp: new Date(),
        });

        const yourDMOpts: UserDM = {
          channel: dm._id,
          recipient: defaultFriend._id,
          open: true,
        };

        const recipientDMOpts: UserDM = {
          channel: dm._id,
          recipient: user._id,
          open: true,
        };

        defaultFriend.social.friends.push(user._id);
        defaultFriend.dms.push(recipientDMOpts);
        user.dms.push(yourDMOpts);
      }

      await Promise.all([
        user.save({ session }),
        defaultServer?.save({ session }),
        defaultFriend?.save({ session }),
        dm?.save({ session }),
        welcomeMessageDoc?.save({ session }),
      ]);
    });
  } catch (err) {
    console.error((err as Error)?.message);
  } finally {
    await session.endSession();
  }
}
