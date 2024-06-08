"use server";

import { generateInviteCode } from "@/utils/helpers/generateInviteCode";
import dbConnect from "./dbConnect";
import Server from "@/models/Server";
import { TextOrVoiceChannel } from "@/types/server";

export const createInvite = async (
  serverId: string,
  channel: TextOrVoiceChannel
) => {
  await dbConnect();

  const server = await Server.findById(serverId);

  if (!server) {
    console.error("Server not found");
    return "";
  }

  const inviteCodes = server.invites.filter(
    (invite) => invite.channel.id === channel._id
  );

  const inviteCode = inviteCodes.at(-1)?.code || generateInviteCode();
  try {
    await Server.findByIdAndUpdate(serverId, {
      $push: {
        invites: {
          code: inviteCode,
          channel: {
            name: channel.name,
            id: channel._id,
          },
          serverId,
        },
      },
    });
  } catch (err) {
    console.error(err);
  }

  return inviteCode;
};
