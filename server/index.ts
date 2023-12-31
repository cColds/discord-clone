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

io.on("connection", (socket) => {
  console.log("server io connected");

  socket.on("send-friend-request", (message) => {
    console.log("emit stuff");

    socket.broadcast.emit("send-friend-request", message);
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
