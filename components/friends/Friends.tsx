import FriendsBody from "./FriendsBody";
import FriendsTab from "./FriendsTab";

export default function Friends() {
  return (
    <div
      className="bg-background-primary grow flex flex-col"
      aria-label="Friends"
    >
      <FriendsTab />

      <FriendsBody />
    </div>
  );
}
