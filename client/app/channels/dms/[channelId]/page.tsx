import { authConfig } from "@/auth.config";
import DmChannel from "@/components/dm/DmChannel";
import UserPanel from "@/components/panels/UserPanel";
import PrivateChannels from "@/components/sidebars/PrivateChannels";
import { getDm } from "@/lib/db/getDm";
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

  const recipient =
    dm.members[0].id === user.id ? dm.members[1] : dm.members[0];

  const pendingRequests = user.social.pending.filter(
    (pending) => pending.request === "Incoming"
  );

  const dmsOpen = user.dms.filter((dm) => dm.open);

  return (
    <>
      <div className="flex h-full">
        <div className="flex flex-col w-60">
          <PrivateChannels
            pendingRequests={pendingRequests.length}
            dms={dmsOpen}
          />
          <UserPanel
            username={user.username}
            displayName={user.displayName}
            email={user.email}
            avatar={user.avatar}
            status={user.status}
          />
        </div>

        <DmChannel user={user} recipient={recipient} />
      </div>
    </>
  );
}
