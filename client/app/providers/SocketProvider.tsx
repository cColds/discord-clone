"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

type OnlineUser = {
  userId: string;
  socketId: string;
};

export const SocketProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<[] | OnlineUser[]>([]);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)("http://localhost:3001", {
      path: "/socket",
    });

    if (userId) {
      socketInstance.emit("new-user-add", userId);
    }

    socketInstance.on("get-users", (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("receive-friend-request", () => {
      console.log("friend req received");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
