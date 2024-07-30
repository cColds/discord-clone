"use client";

import { getUser } from "@/lib/db/getUser";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        path: "/socket",
      }
    );

    if (userId) {
      getUser(userId)
        .then((userData) => {
          socketInstance.emit("new-user-add", userId, userData?.username);
        })
        .catch((err) => console.error(err));
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

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, pathname]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
