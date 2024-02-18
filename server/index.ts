const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
  path: "/socket",
});

let activeUsers: Record<string, { socketId: string }> = {};
let socketToUserMap: Record<string, { userId: string }> = {};

io.on("connection", (socket) => {
  console.log("A user has connected", socket.id);

  socket.on("new-user-add", (newUserId) => {
    const userExists = activeUsers[newUserId];
    if (!userExists) {
      activeUsers[newUserId] = { socketId: socket.id };
      socketToUserMap[socket.id] = { userId: newUserId };
    }

    console.log("User connected", activeUsers);

    io.emit("get-users", activeUsers);
  });

  // todo: maybe create a function to emit sockets to users because a lot of socket event listener duplicate code

  socket.on("send-friend-request", ({ senderId, recipientId }) => {
    const sender = activeUsers[senderId];
    const recipient = activeUsers[recipientId];

    console.log({ sender, recipient });

    if (!sender || !recipient) {
      console.log("Sender or recipient socket not found", {
        sender,
        recipient,
      });

      return;
    }

    io.to(recipient.socketId).emit("update-friend-list");
    io.to(sender.socketId).emit("update-friend-list");
  });

  socket.on("accept-friend-request", ({ senderId, recipientId }) => {
    const sender = activeUsers[senderId];
    const recipient = activeUsers[recipientId];

    if (!sender || !recipient) {
      console.log("Sender or recipient socket not found", {
        sender,
        recipient,
      });

      return;
    }

    io.to(sender.socketId).emit("update-friend-list");
    io.to(recipient.socketId).emit("update-friend-list");
  });

  socket.on("unfriend-user", ({ senderId, recipientId }) => {
    const sender = activeUsers[senderId];
    const recipient = activeUsers[recipientId];

    if (!sender || !recipient) {
      console.log("Sender or recipient socket not found", {
        sender,
        recipient,
      });

      return;
    }

    io.to(sender.socketId).emit("update-friend-list");
    io.to(recipient.socketId).emit("update-friend-list");
  });

  socket.on("cancel-pending-request", ({ senderId, recipientId }) => {
    const sender = activeUsers[senderId];
    const recipient = activeUsers[recipientId];

    if (!sender || !recipient) {
      console.log("Sender or recipient socket not found", {
        sender,
        recipient,
      });
      return;
    }

    io.to(sender.socketId).emit("update-friend-list");
    io.to(recipient.socketId).emit("update-friend-list");
  });

  socket.on("unblock-user", ({ senderId, recipientId }) => {
    const sender = activeUsers[senderId];
    const recipient = activeUsers[recipientId];

    if (!sender || !recipient) {
      console.log("Sender or recipient socket not found", {
        sender,
        recipient,
      });
      return;
    }

    io.to(sender.socketId).emit("update-friend-list");
    io.to(recipient.socketId).emit("update-friend-list");
  });

  socket.on("disconnect", () => {
    const userMapping = socketToUserMap[socket.id];
    if (userMapping) {
      const { userId } = userMapping;
      delete activeUsers[userId];
      delete socketToUserMap[socket.id];
      console.log("User disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    } else {
      console.log("User disconnected but mapping not found");
    }
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
