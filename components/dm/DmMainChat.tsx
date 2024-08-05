"use client";

import { MessageType } from "@/types/message";
import { useUser } from "@/app/providers/UserProvider";
import { redirect } from "next/navigation";

import MessageList from "../message/item/MessageList";

export default function DmMainChat({ messages }: { messages: MessageType[] }) {
  const { user } = useUser();
  if (!user) redirect("/");

  return (
    <ol className="mb-[30px] min-h-[150px] overflow-hidden">
      <MessageList messages={messages} user={user} />
    </ol>
  );
}
