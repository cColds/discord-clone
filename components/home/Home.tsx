"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="h-full bg-background-secondary">
      <div className="p-10">
        <h1 className="text-3xl">Home</h1>
        <p className="mt-2">Session: {JSON.stringify(session, null, 2)}</p>
      </div>
    </div>
  );
}
