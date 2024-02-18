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

  if (!sender || !recipient) {
    console.log("Sender or recipient socket not found", { sender, recipient });
    return;
  }

  io.to(sender.socketId).emit("update-friend-list");
  io.to(recipient.socketId).emit("update-friend-list");
}
