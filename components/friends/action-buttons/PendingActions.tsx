import ActionButton from "@/components/tooltip/ActionButton";
import { Accept, Cancel } from "@/components/svgs";

const PendingActions = ({
  type,
  id,
}: {
  type: "Incoming" | "Outgoing";
  id: string;
}) => {
  return (
    <>
      {type === "Incoming" ? (
        <>
          <ActionButton
            name="Accept"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-info-positive-foreground"
          >
            <Accept />
          </ActionButton>
          <ActionButton
            name="Ignore"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-info-danger-foreground"
          >
            <Cancel />
          </ActionButton>
        </>
      ) : (
        <ActionButton
          name="Cancel"
          onClick={() =>
            console.log("Add logic to cancel outgoing friend request")
          }
          className="hover:text-info-danger-foreground"
        >
          <Cancel />
        </ActionButton>
      )}
    </>
  );
};

export default PendingActions;
