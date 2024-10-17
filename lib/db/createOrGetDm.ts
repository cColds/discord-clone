"use server";

import Dm from "@/models/Dm";
import dbConnect from "./dbConnect";
import { DmType } from "@/types/user";
import User from "@/models/User";

export const createOrGetDm = async (userId: string, recipientId: string) => {
  await dbConnect();

  const getDm = await Dm.findOne({ members: { $all: [userId, recipientId] } });
  let dm = getDm;

  if (!getDm) {
    const newDm = new Dm({
      members: [userId, recipientId],
      lastMessageTimestamp: new Date(),
    });

    await Promise.all([
      newDm.save(),

      User.findByIdAndUpdate(userId, {
        $push: {
          dms: { channel: newDm._id, recipient: recipientId, open: true },
        },
      }),
      User.findByIdAndUpdate(recipientId, {
        $push: { dms: { channel: newDm._id, recipient: userId, open: true } },
      }),
    ]);

    dm = newDm;
  }

  const serializedDm = JSON.parse(JSON.stringify(dm)) as DmType;

  return serializedDm;
};
