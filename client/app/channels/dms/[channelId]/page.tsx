"use server";

import { authConfig } from "@/auth.config";
import DmPageClient from "@/components/dm/DmPageClient";
import { getDm } from "@/lib/db/getDm";
import { getMessages } from "@/lib/db/getMessages";
import { getUser } from "@/lib/db/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DmPage({
  params,
}: {
  params: { channelId: string };
}) {
  const session = await getServerSession(authConfig);

  const user = await getUser(session?.user.id);
  if (user == null) redirect("/login");

  const dm = await getDm(params.channelId);

  if (dm == null) redirect("/");

  const messages = await getMessages(25, params.channelId);

  const recipient =
    dm.members[0].id === user.id ? dm.members[1] : dm.members[0];

  const pendingRequests = user.social.pending.filter(
    (pending) => pending.request === "Incoming"
  ).length;

  const dmsOpen = user.dms.filter((dm) => dm.open);

  return (
    <DmPageClient
      recipient={recipient}
      pendingRequests={pendingRequests}
      dmsOpen={dmsOpen}
      messages={messages}
    />
  );
}
