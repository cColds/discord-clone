import { getServerSession } from "next-auth";
import Friends from "../friends/Friends";
import UserPanel from "../panels/UserPanel";
import PrivateChannels from "../sidebars/PrivateChannels";
import { authConfig } from "@/auth.config";
import { getUser } from "@/lib/db/getUser";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authConfig);
  const user = await getUser(session?.user.id);
  if (user == null) redirect("/login");

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels />
        <UserPanel
          username={user.username}
          displayName={user.displayName}
          email={user.email}
          avatar={user.avatar}
          status={user.status}
        />
      </div>

      <Friends social={user.social} />
    </div>
  );
}
