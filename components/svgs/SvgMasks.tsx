export default function SvgMasks() {
  return (
    <svg
      viewBox="0 0 1 1"
      aria-hidden="true"
      className="absolute pointer-events-none top-[-1px] left-[-1px] w-[1px] h-[1px]"
    >
      <mask
        id="svg-mask-avatar-status-round-32"
        maskContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
      >
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        <circle fill="black" cx="0.84375" cy="0.84375" r="0.25"></circle>
      </mask>

      <mask
        id="svg-mask-avatar-status-round-80"
        maskContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
      >
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        <circle fill="black" cx="0.85" cy="0.85" r="0.175"></circle>
      </mask>

      {/* STATUSES */}

      <mask
        id="svg-mask-status-offline"
        maskContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
      >
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        <circle fill="black" cx="0.5" cy="0.5" r="0.25"></circle>
      </mask>

      <mask
        id="svg-mask-status-online"
        maskContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
      >
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
      </mask>

      <mask
        id="svg-mask-status-idle"
        maskContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
      >
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        <circle fill="black" cx="0.25" cy="0.25" r="0.375"></circle>
      </mask>

      <mask
        id="svg-mask-status-offline"
        maskContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
      >
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        <circle fill="black" cx="0.5" cy="0.5" r="0.25"></circle>
      </mask>

      <mask
        id="svg-mask-status-dnd"
        maskContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
      >
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        <rect
          fill="black"
          x="0.125"
          y="0.375"
          width="0.75"
          height="0.25"
          rx="0.125"
          ry="0.125"
        ></rect>
      </mask>
    </svg>
  );
}
