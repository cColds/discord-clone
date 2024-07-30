export function TypingDots({ className }: { className?: string }) {
  return (
    <svg width="24.5" height="7">
      <g>
        <circle
          className="dot first"
          cx="3.5"
          cy="3.5"
          r="3.5"
          fill="currentColor"
        ></circle>
        <circle
          className="dot second"
          cx="12.25"
          cy="3.5"
          r="3.5"
          fill="currentColor"
        ></circle>
        <circle
          className="dot third"
          cx="21"
          cy="3.5"
          r="3.5"
          fill="currentColor"
        ></circle>
      </g>
    </svg>
  );
}
