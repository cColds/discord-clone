type ProfileBannerProps = {
  className?: string;
  viewBox: "0 0 300 105" | "0 0 660 100";
  previewProfile?: boolean;
};

export const ProfileBanner = ({
  className,
  viewBox,
  previewProfile = false,
}: ProfileBannerProps) => {
  return (
    <svg className={className} viewBox={viewBox}>
      <mask id="profile-pic-top">
        <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
        {previewProfile ? (
          <circle fill="black" cx="56" cy="101" r="46"></circle>
        ) : (
          <circle fill="black" cx="62" cy="122" r="46"></circle>
        )}
      </mask>
      <foreignObject
        x="0"
        y="0"
        width="100%"
        height="100%"
        overflow="visible"
        mask="url(#profile-pic-top)"
      >
        <div
          className={`bg-[#2B5269] ${
            previewProfile ? "h-[105px]" : "h-[105px]"
          }`}
        />
      </foreignObject>
    </svg>
  );
};
