import Friends from "../friends/Friends";
import UserPanel from "../panels/UserPanel";
import PrivateChannels from "../sidebars/PrivateChannels";

export default function Home() {
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-60">
        <PrivateChannels />
        <UserPanel />
      </div>

      <Friends />
    </div>
  );
}
