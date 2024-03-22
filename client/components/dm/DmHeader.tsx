import { UserType } from "@/types/user";
import AvatarMask from "../avatar/AvatarMask";

export default function DmHeader({ recipient }: { recipient: UserType }) {
  return (
    <section
      className="flex items-center min-h-[48px] p-2 shadow-elevation-low"
      aria-label="Channel Header"
    >
      <div className="flex items-center">
        <div className="ml-2 mr-3 w-6 h-6">
          <AvatarMask
            avatar={recipient.avatar}
            username={recipient.username}
            status={recipient.status}
            svgHeight={30}
            svgWidth={30}
            imgWidth={24}
            imgHeight={24}
            rectWidth={8}
            rectHeight={8}
            rectX={16}
            rectY={16}
          />
        </div>
        <h1 className="font-bold mr-2">{recipient.displayName}</h1>
      </div>
    </section>
  );
}
