import ActionTooltip from "./ActionTooltip";

type ActionButtonProps = {
  children: React.ReactNode;
  name: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButton = ({ children, name, ...props }: ActionButtonProps) => {
  return (
    <ActionTooltip content={name}>
      <button
        className="flex justify-center items-center text-interactive-normal hover:text-interactive-hover bg-background-secondary rounded-full w-9 h-9 group-hover:bg-background-tertiary"
        {...props}
      >
        {children}
      </button>
    </ActionTooltip>
  );
};

export default ActionButton;
