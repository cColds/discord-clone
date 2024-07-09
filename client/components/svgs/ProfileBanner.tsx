export const ProfileBanner = () => {
  return (
    <svg className="min-w-[660px] min-h-[100px] z-0 " viewBox="0 0 660 100">
      <mask id="profile-pic-top">
        <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
        <circle fill="black" cx="62" cy="122" r="46"></circle>
      </mask>
      <foreignObject
        x="0"
        y="0"
        width="100%"
        height="100%"
        overflow="visible"
        mask="url(#profile-pic-top)"
      >
        <div className="bg-[#2B5269] h-[100px] min-h-[100px]" />
      </foreignObject>
    </svg>
  );
};
