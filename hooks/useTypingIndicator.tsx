import { useSocket } from "@/app/providers/SocketProvider";
import { useEffect, useRef } from "react";

type UserTyping = {
  displayName: string;
  userId: string;
};

export const useTypingIndicator = (
  setUsersTyping: React.Dispatch<React.SetStateAction<UserTyping[]>>
) => {
  const { socket } = useSocket();
  const typingTimerRef = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "show-typing-indicator",
      (user: { displayName: string; userId: string }) => {
        setUsersTyping((current) => {
          const isUserAlreadyTyping = current.some(
            (u) => u.userId === user.userId
          );

          if (!isUserAlreadyTyping) {
            if (typingTimerRef?.current) {
              clearTimeout(typingTimerRef?.current);
            }

            const timerId = setTimeout(() => {
              setUsersTyping((current) =>
                current.filter((u) => u.userId !== user.userId)
              );
            }, 10000);

            typingTimerRef.current = timerId;

            return [...current, user];
          }
          return current;
        });
      }
    );
    socket.on(
      "stop-typing-indicator",
      (user: { displayName: string; userId: string }) => {
        setUsersTyping((current) =>
          current.filter((u) => u.userId !== user.userId)
        );
      }
    );

    return () => {
      socket.off("show-typing-indicator");
      socket.off("stop-typing-indicator");

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [socket]);

  return socket;
};
