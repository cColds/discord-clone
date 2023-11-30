import { Unblock } from "@/components/svgs";
import ActionButton from "@/components/tooltip/ActionButton";

const BlockedActions = ({ id }: { id: string }) => {
  return (
    <ActionButton
      name="Unblock"
      onClick={(e) => e.stopPropagation()}
      className="hover:text-info-danger-foreground"
    >
      <Unblock />
    </ActionButton>
  );
};

export default BlockedActions;
