import AddFriendSearchBar from "@/components/search/AddFriendSearchBar";
import { Arrow, Explore } from "@/components/svgs";

export default function AddFriend() {
  return (
    <div className="flex flex-col grow">
      <header className=" border-b-background-modifier-accent border-b-[1px] px-[30px] py-5">
        <h2 className="uppercase text-header-primary mb-2 font-bold">
          Add Friend
        </h2>
        <p className="text-header-secondary text-sm">
          You can add friends with their Discord username.
        </p>

        <AddFriendSearchBar />
      </header>

      <header className="px-[30px] py-5">
        <h2 className="uppercase text-header-primary font-bold">
          Other places to make friends
        </h2>
      </header>

      <div className="grid grid-cols-2 px-[20px]">
        <button className="flex items-center rounded-lg bg-background-secondary border-[1px] border-background-modifier-accent w-full hover:bg-background-modifier-hover min-w-[200px] px-1.5 py-[1px]">
          <div className="bg-green-360 w-9 h-9 m-2 rounded-lg flex items-center justify-center">
            <Explore />
          </div>

          <span className="overflow-hidden text-ellipsis">
            Explore Discoverable Servers {/* text-text-normal  */}
          </span>

          <Arrow className="ml-auto mr-4 text-interactive-normal" />
        </button>
      </div>

      <div className="flex justify-center items-center flex-col">
        <div className="bg-wumpus-waiting-friends w-[376px] h-[162px] mb-10" />

        <p className="text-text-muted text-center mt-2">
          Wumpus is waiting on friends. You don&apos;t have to though!
        </p>
      </div>
    </div>
  );
}
