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

  socket.on("send-friend-request", ({ senderId, receiverId }) => {
    const userSender = activeUsers[senderId];
    const userRecipient = activeUsers[receiverId];

    if (!userSender || !userRecipient) {
      console.log("User sender or recipient not found");
      return;
    }

    io.to(userRecipient.socketId).emit("update-friend-list");
    io.to(userSender.socketId).emit("update-friend-list");
  });

  socket.on("accept-friend-request", ({ accepterId, requesterId }) => {
    const accepter = activeUsers[accepterId];
    const requester = activeUsers[requesterId];

    if (!accepter || !requester) {
      console.log("Accepter or requester not found");
      return;
    }

    io.to(accepter.socketId).emit("update-friend-list");
    io.to(requester.socketId).emit("update-friend-list");
  });

  socket.on("unfriend-user", ({ senderId, recipientId }) => {
    const sender = activeUsers[senderId];
    const recipient = activeUsers[recipientId];

    if (!sender || !recipient) {
      console.log("Sender or recipient socket not found");
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
