import { sendMessage } from "@/lib/actions/sendMessage";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useTypingIndicator } from "./useTypingIndicator";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { UserNormal, UserType } from "@/types/user";
import { MessageType } from "@/types/message";
import { getServer } from "@/lib/db/getServer";
import { getDm } from "@/lib/db/getDm";

type PreviewImageType = {
  name: string;
  id: string;
  url: string;
};

type useMessageHandlerProps = {
  sender: UserType;
  recipient?: UserType;
  type: "dm" | "server";
  addOptimisticMessage: (msg: MessageType) => void;
};

const useMessageHandler = ({
  sender,
  recipient,
  type,
  addOptimisticMessage,
}: useMessageHandlerProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [usersTyping, setUsersTyping] = useState<
    { displayName: string; userId: string }[]
  >([]);
  const [previewImages, setPreviewImages] = useState<PreviewImageType[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);

  const socket = useTypingIndicator(setUsersTyping);
  const { serverId, channelId } = useParams<{
    channelId: string;
    serverId?: string;
  }>();

  const handleMessageSubmit = async () => {
    try {
      const form = new FormData();
      form.append("message", message);
      if (filesToUpload) {
        for (let i = 0; i < filesToUpload.length; i += 1) {
          form.append("file[]", filesToUpload[i]);
        }
      }

      const senderNormal: UserNormal = {
        _id: sender.id,
        username: sender.username,
        displayName: sender.displayName,
        email: sender.email,
        avatar: sender.avatar,
        status: sender.status,
        servers: [],
        social: {
          friends: [],
          pending: [],
          blocked: [],
        },
        dms: sender.dms.map((dm) => ({
          channel: dm.channel._id,
          recipient: dm.recipient.id,
          open: dm.open,
          id: dm.id,
        })),
      };

      const timestamp = new Date().toISOString();

      const optimisticMsg = {
        message: message,
        _id: uuidv4(),
        channelId,
        images: filesToUpload
          ? [
              {
                name: previewImages[0].name,
                url: previewImages[0].url,
                id: previewImages[0].id,
              },
            ]
          : [],
        sender: senderNormal,
        createdAt: timestamp,
        updatedAt: timestamp,
        pending: true,
        readBy: [sender.id],
      };

      addOptimisticMessage(optimisticMsg);

      setMessage("");
      setPreviewImages([]);
      setFilesToUpload(null);
      await sendMessage(
        sender.id,
        form,
        Array.isArray(channelId) ? channelId[0] : channelId,
        type
      );

      let membersIds: string[] = [];

      if (serverId) {
        const server = await getServer(serverId);

        const serverMembers = server?.members
          .filter((member) => member._id !== sender.id)
          .map((member) => member._id);

        membersIds = serverMembers || [];
      } else {
        const dm = await getDm(channelId);

        const dmMembers = dm?.members
          .filter((member) => member.id !== sender.id)
          .map((member) => member.id);

        membersIds = dmMembers || [];
      }

      socket.emit("send-message", channelId, membersIds);
      socket.emit("stop-typing", channelId, {
        userId: sender.id,
        displayName: sender.displayName,
      });
      if (type === "dm") {
        socket.emit("update-dms-list", recipient?.id || "", sender.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isValidMessage = message.trim() || filesToUpload?.length;

    const hitEnter = e.key === "Enter" && !e.shiftKey;

    if (hitEnter && !isValidMessage) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value !== "") {
      socket.emit("typing-indicator", channelId, {
        userId: sender.id,
        displayName: sender.displayName,
      });
    }
    setMessage(e.currentTarget.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggleDropdownMenu();

    const files = e.currentTarget.files;

    if (!files) return;

    const newFiles = Array.from(files).map((file) => {
      return { name: file.name, id: uuidv4(), url: URL.createObjectURL(file) };
    });

    setFilesToUpload(files);

    setPreviewImages((prevState) => [...prevState, ...newFiles]);
  };

  const handleRemovePreviewImage = (id: string) => {
    const filteredImages = previewImages.filter(
      (previewImage) => previewImage.id !== id
    );

    setPreviewImages(filteredImages);
  };

  const toggleDropdownMenu = () => {
    setOpen(!open);
  };

  return {
    open,
    message,
    usersTyping,
    previewImages,
    filesToUpload,
    handleKeyDown,
    handleChange,
    handleFileChange,
    handleRemovePreviewImage,
    toggleDropdownMenu,
  };
};

export default useMessageHandler;
