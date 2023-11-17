import Online from "./tabs/Online";

export default function FriendsBody() {
  return (
    <div className="flex grow">
      {/* Should add the rest of the tab components at some point */}
      <Online />

      <aside className="min-w-[360px] max-w-[420px] basis-[30%] p-4 border-l-[1px] border-background-modifier-accent">
        Activity Bar
      </aside>
    </div>
  );
}
