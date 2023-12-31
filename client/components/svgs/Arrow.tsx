export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        clipRule="evenodd"
        d="m5.41667 4.2625 5.66573 5.7375-5.66573 5.7375 1.74426 1.7625 7.42237-7.5-7.42237-7.5z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  );
}
