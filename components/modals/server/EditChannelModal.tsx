import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ServerType, TextOrVoiceChannel } from "@/types/server";
import { Hash, Volume } from "@/components/svgs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editChannelSchema } from "@/lib/validations/editChannelSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { editChannel } from "@/lib/actions/editChannel";
import { UserType } from "@/types/user";
import { useSocket } from "@/app/providers/SocketProvider";

type EditChannelModalProps = {
  open: boolean;
  onToggleModal: () => void;
  channel: TextOrVoiceChannel;
  server: ServerType;
  user: UserType;
};

const EditChannelModal = ({
  open,
  onToggleModal,
  channel,
  user,
  server,
}: EditChannelModalProps) => {
  const form = useForm<z.infer<typeof editChannelSchema>>({
    resolver: zodResolver(editChannelSchema),
    defaultValues: { channelName: channel.name },
  });
  const [isPending, startTransition] = useTransition();
  const { socket } = useSocket();

  const onSubmit = (data: z.infer<typeof editChannelSchema>) => {
    startTransition(async () => {
      try {
        const serverDoc = await editChannel({
          formData: data,
          channelId: channel._id,
          serverId: server._id,
          userId: user.id,
        });
        socket.emit("update-server", serverDoc?.members || []);

        onToggleModal();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        onToggleModal();
        form.reset({ channelName: channel.name });
      }}
    >
      <DialogContent
        removeCloseButton={true}
        className="rounded bg-background-primary p-0 w-[440px] max-h-[720px] min-h-[200px]"
      >
        <DialogHeader className="px-4 pt-4 overflow-hidden">
          <DialogTitle className="flex gap-2 text-left text-xl truncate">
            Edit Channel
            <div className="flex items-center overflow-hidden">
              <div className="mr-1.5" aria-label="Text icon">
                {channel.type === "text" ? (
                  <Hash className="text-channel-icon w-5 h-5 block shrink-0" />
                ) : (
                  <Volume className="text-channel-icon w-5 h-5 block shrink-0" />
                )}
              </div>
              <p className="truncate">{channel.name}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden.Root></VisuallyHidden.Root>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-4"
            id="edit-channel"
          >
            <FormField
              name="channelName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="text-slate-300 w-full font-bold">
                  <FormLabel className="font-bold uppercase tracking-wide text-xs">
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="text" {...field} maxLength={100} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="bg-background-secondary p-4">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="hover:underline text-sm"
              onClick={() => {
                onToggleModal();
                form.reset({ channelName: channel.name });
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="disabled:cursor-not-allowed disabled:opacity-80 self-start bg-status-positive-background hover:bg-status-positive-background-hover active:bg-status-positive-background-active px-4 py-1 text-sm h-8 min-w-[60px] min-h-[32px] transition duration-200"
              disabled={isPending}
              form="edit-channel"
            >
              Save Changes
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
