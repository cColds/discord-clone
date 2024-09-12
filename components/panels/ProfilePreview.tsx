import { UserType } from "@/types/user";
import { ProfileBanner } from "../svgs";
import AvatarMask from "../avatar/AvatarMask";

type ProfilePreviewProps = {
  user: UserType;
  formState: { displayName: string; avatar: File | null };
  previewImage: string | null;
};

export default function ProfilePreview({
  user,
  formState,
  previewImage,
}: ProfilePreviewProps) {
  return (
    <div>
      <h3 className="truncate text-header-secondary text-xs font-bold uppercase tracking-wide mb-2">
        Preview
      </h3>

      <div className="flex flex-col gap-2 bg-surface-overlay pb-1 rounded overflow-hidden relative">
        <header className="pb-10">
          <ProfileBanner
            className="min-w-[300px] min-h-[100px] z-0"
            viewBox="0 0 300 105"
            previewProfile={true}
            url={user.avatar}
          />
          <div className="absolute top-[61px] left-4">
            <AvatarMask
              username={user.username}
              status={user.status}
              avatar={previewImage || "/images/profile-pictures/blurple.png"}
              svgWidth={92}
              svgHeight={92}
              imgWidth={80}
              imgHeight={80}
              rectX={60}
              rectY={60}
              rectHeight={16}
              rectWidth={16}
              maskSize={80}
            />
          </div>
        </header>

        <div className="flex flex-col px-4 pb-2">
          <h3 className="truncate text-header-primary font-bold max-h-[72px] text-xl ">
            {formState.displayName || user.username}
          </h3>
          <p className="truncate text-header-primary inline">{user.username}</p>
        </div>
        <footer className="px-4 pb-3">
          <button
            type="button"
            className="w-full truncate text-sm leading-4 px-4 py-0.5 bg-button-secondary-background min-w-[60px] min-h-[32px] h-8 transition duration-200 ease-in-out rounded hover:bg-button-secondary-background-hover active:bg-button-secondary-background-active"
          >
            Example Button
          </button>
        </footer>
      </div>
    </div>
  );
}
