import Dm from "@/models/Dm";
import User from "@/models/User";
import { Types } from "mongoose";

export const handleIncomingRequest = async (
  senderId: string,
  recipientId: string
) => {
  const senderObjectId = new Types.ObjectId(senderId);
  const recipientObjectId = new Types.ObjectId(recipientId);

  const dm = new Dm({
    members: [senderObjectId, recipientObjectId],
    lastMessageTimestamp: new Date(),
  });

  await dm.save();

  await User.findByIdAndUpdate(senderId, {
    $push: {
      dms: {
        channel: dm._id,
        recipient: recipientObjectId,
        open: true,
      },
    },
  });

  await User.findByIdAndUpdate(recipientId, {
    $push: {
      dms: {
        channel: dm._id,
        recipient: senderObjectId,
        open: true,
      },
    },
  });
};

export const unblockAndSendRequest = async (
  senderId: string,
  recipientId: string
) => {
  await Promise.all([
    User.findByIdAndUpdate(senderId, {
      $pull: { "social.blocked": recipientId },
      $push: {
        "social.pending": { user: recipientId, request: "Outgoing" },
      },
    }),
    User.findByIdAndUpdate(recipientId, {
      $push: {
        "social.pending": { user: senderId, request: "Incoming" },
      },
    }),
  ]);
};

export const sendFriendRequest = async (
  senderId: string,
  recipientId: string
) => {
  await Promise.all([
    User.findByIdAndUpdate(senderId, {
      $push: {
        "social.pending": { user: recipientId, request: "Outgoing" },
      },
    }),
    User.findByIdAndUpdate(recipientId, {
      $push: {
        "social.pending": { user: senderId, request: "Incoming" },
      },
    }),
  ]);
};
