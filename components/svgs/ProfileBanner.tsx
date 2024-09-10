import { v4 as uuidv4 } from "uuid";

type ProfileBannerProps = {
  className?: string;
  viewBox: "0 0 300 105" | "0 0 660 100" | "0 0 340 120";
  previewProfile?: boolean;
};

export const ProfileBanner = ({
  className,
  viewBox,
  previewProfile = false,
}: ProfileBannerProps) => {
  const uuid = uuidv4();

  return (
    <svg className={className} viewBox={viewBox}>
      <mask id={`profile-pic-top-${uuid}`}>
        <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
        {previewProfile ? (
          <circle fill="black" cx="56" cy="101" r="46"></circle>
        ) : (
          <circle fill="black" cx="62" cy="122" r="46"></circle>
        )}
        {/* should use if its dm sidebar profile <circle fill="black" cx="56" cy="112" r="46"></circle> */}

        {/* todo: banner size preset like small, med, xl */}
      </mask>
      <foreignObject
        x="0"
        y="0"
        width="100%"
        height="100%"
        overflow="visible"
        mask={`url(#profile-pic-top-${uuid})`}
      >
        {/* todo: add color thief  or node vibrant to get img color*/}
        <div
          className={`bg-[#2B5269] ${
            previewProfile ? "h-[105px]" : "h-[105px]"
          }`}
        />
      </foreignObject>
    </svg>
  );
};
