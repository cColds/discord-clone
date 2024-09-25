import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useTypingIndicator } from "./useTypingIndicator";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { UserType } from "@/types/user";
import { getServer } from "@/lib/db/getServer";
import { getDm } from "@/lib/db/getDm";
import {
  CreateMessageVariables,
  useCreateMessage,
} from "@/lib/services/mutations";

type PreviewImageType = {
  name: string;
  id: string;
  url: string;
};

type useMessageHandlerProps = {
  sender: UserType;
  recipient?: UserType;
  type: "dm" | "server";
};

const useMessageHandler = ({
  sender,
  recipient,
  type,
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

  const createMessageMutation = useCreateMessage();

  const handleMessageSubmit = async () => {
    try {
      const form = new FormData();
      form.append("message", message);
      if (filesToUpload) {
        for (let i = 0; i < filesToUpload.length; i += 1) {
          form.append("file[]", filesToUpload[i]);
        }
      }

      setMessage("");
      setPreviewImages([]);
      setFilesToUpload(null);

      const messageParams: CreateMessageVariables = {
        sender: sender.id,
        formData: form,
        channelId,
        type,
      };

      await createMessageMutation.mutateAsync(messageParams);

      const serverOrDm = serverId
        ? await getServer(serverId)
        : await getDm(channelId);
      const memberIds =
        serverOrDm?.members
          .filter((member) => member.id !== sender.id)
          .map((member) => member.id) || [];

      socket.emit("send-message", channelId, memberIds);
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
