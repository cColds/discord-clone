import { Message, More } from "@/components/svgs";
import ActionButton from "@/components/tooltip/ActionButton";
import { useRouter } from "next/navigation";

const FriendActions = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <>
      <ActionButton
        name="Message"
        onClick={() => router.push(`/channels/${id}`)}
      >
        <Message />
      </ActionButton>

      <ActionButton name="More" onClick={(e) => e.stopPropagation()}>
        <More />
      </ActionButton>
    </>
  );
};

export default FriendActions;
