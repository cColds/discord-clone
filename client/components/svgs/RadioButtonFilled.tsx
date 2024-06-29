export const RadioButtonFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      aria-hidden="true"
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="currentColor"
      ></path>
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="currentColor"
        className="text-interactive-active"
      ></circle>
    </svg>
  );
};
