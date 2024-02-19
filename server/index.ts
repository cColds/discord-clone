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
import { updateFriendList } from "./utils/updateFriendsList";

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

    console.log("User connected. Current Active Users: ", activeUsers);

    io.emit("get-users", activeUsers);
  });

  socket.on("send-friend-request", ({ senderId, recipientId }) => {
    updateFriendList({ io, senderId, recipientId, activeUsers });
  });

  socket.on("accept-friend-request", ({ senderId, recipientId }) => {
    updateFriendList({ io, senderId, recipientId, activeUsers });
  });

  socket.on("unfriend-user", ({ senderId, recipientId }) => {
    updateFriendList({ io, senderId, recipientId, activeUsers });
  });

  socket.on("cancel-pending-request", ({ senderId, recipientId }) => {
    updateFriendList({ io, senderId, recipientId, activeUsers });
  });

  socket.on("unblock-user", ({ senderId, recipientId }) => {
    updateFriendList({ io, senderId, recipientId, activeUsers });
  });

  socket.on("disconnect", () => {
    const userMapping = socketToUserMap[socket.id];
    if (userMapping) {
      const { userId } = userMapping;
      delete activeUsers[userId];
      delete socketToUserMap[socket.id];
      console.log("User disconnected. Current Active Users: ", activeUsers);
      io.emit("get-users", activeUsers);
    } else {
      console.log("User disconnected but mapping not found");
    }
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
