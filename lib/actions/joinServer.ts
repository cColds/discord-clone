"use server";

import { z } from "zod";
import { joinServerSchema } from "@/lib/validations/joinServer";
import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";
import { UserType } from "@/types/user";
import User from "@/models/User";
import mongoose from "mongoose";
import Message from "@/models/Message";
import { getRandomWelcomeMessage } from "@/utils/helpers/getRandomWelcomeMessage";

export const joinServer = async (
  formData: z.infer<typeof joinServerSchema>,
  user: UserType
) => {
  const validatedFields = joinServerSchema.safeParse(formData);
  if (!validatedFields.success) return;

  const { invite } = validatedFields.data;
  await dbConnect();

  try {
    const server = await Server.findOne({ "invites.code": invite });

    if (!server) return;

    const userAlreadyInServer = server.members.find(
      (member) => member._id.toString() === user.id
    );

    if (userAlreadyInServer) {
      return;
    }

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const messageDoc = new Message({
        sender: user,
        message: getRandomWelcomeMessage(),
        channelId: server.categories[0].channels[0]._id,
        images: [],
        readBy: [],
        type: "system",
      });
      return Promise.all([
        User.findByIdAndUpdate(
          user.id,
          { $push: { servers: server._id } },
          { session }
        ),
        Server.findByIdAndUpdate(
          server.id,
          {
            $push: { members: user.id },
          },
          { session }
        ),
        messageDoc.save({ session }),
      ]);
    });

    return JSON.parse(JSON.stringify(server)) as typeof server;
  } catch (err) {
    console.error("join server error", err);
  }
};
