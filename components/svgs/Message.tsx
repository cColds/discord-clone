type MessageProps = {
  width?: number;
  height?: number;
};

export function Message({ width = 20, height = 20 }: MessageProps) {
  return (
    <svg
      aria-hidden="true"
      role="img"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fill="currentColor"
        d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"
      ></path>
    </svg>
  );
}
