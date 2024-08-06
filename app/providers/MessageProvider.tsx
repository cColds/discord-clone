"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MessageType } from "@/types/message";
import { useSocket } from "@/app/providers/SocketProvider";
import { getMessages } from "@/lib/db/getMessages";
import { useParams } from "next/navigation";

type MessageContextType = {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

const MessageContext = createContext<MessageContextType>({
  messages: [],
  setMessages: () => {},
});

export const useMessages = () => useContext(MessageContext);

type MessageProviderProps = {
  children: React.ReactNode;
};
export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { socket } = useSocket();
  const { channelId } = useParams<{ channelId?: string }>();

  useEffect(() => {
    if (!socket) return;

    const fetchMessages = async () => {
      const initialMessages = await getMessages(25, channelId || "");
      if (initialMessages) {
        setMessages(initialMessages);
      }
    };

    fetchMessages();

    socket.on("received-message", async (newMessage: MessageType) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("received-message");
    };
  }, [socket, channelId]);

  const value = {
    messages,
    setMessages,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};
