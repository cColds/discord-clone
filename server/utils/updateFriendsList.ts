import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type SocketProps = {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  senderId: string;
  recipientId: string;
  activeUsers: Record<
    string,
    {
      socketId: string;
    }
  >;
};

export function updateFriendList({
  io,
  senderId,
  recipientId,
  activeUsers,
}: SocketProps) {
  const sender = activeUsers[senderId];
  const recipient = activeUsers[recipientId];

  console.log({ sender, recipient });

  if (sender) {
    io.to(sender.socketId).emit("update-friend-list");
    console.log(`Emitted to sender ${sender.socketId}`);
  }

  if (recipient) {
    io.to(recipient.socketId).emit("update-friend-list");
    console.log(`Emitted to recipient ${recipient.socketId}`);
  }
}
