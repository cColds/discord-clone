"use server";

import { z } from "zod";
import { joinServerSchema } from "@/lib/validations/joinServer";
import dbConnect from "@/lib/db/dbConnect";
import Server from "@/models/Server";
import { UserType } from "@/types/user";
import User from "@/models/User";
import mongoose from "mongoose";

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
      console.log("Already in the server!");

      return;
    }

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      return await Promise.all([
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
      ]);
    });

    return JSON.parse(JSON.stringify(server)) as typeof server;
  } catch (err) {
    console.error("join server error", err);
  }
};
