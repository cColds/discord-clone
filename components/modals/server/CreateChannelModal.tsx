import { useSocket } from "@/app/providers/SocketProvider";
import RadioItem from "@/components/RadioItem";
import { Hash, Volume } from "@/components/svgs";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createChannel } from "@/lib/actions/createChannel";
import { createChannelSchema } from "@/lib/validations/createChannel";
import { ServerCategory } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateChannelModalProps = {
  children: React.ReactNode;
  category: ServerCategory;
  serverId: string;
};

const CreateChannelModal = ({
  category,
  serverId,
  children,
}: CreateChannelModalProps) => {
  const form = useForm<z.infer<typeof createChannelSchema>>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: { channelName: "", channelType: "text" },
  });

  const [selectedChannelType, setSelectedChannelType] = useState<
    "text" | "voice"
  >("text");

  const [open, setOpen] = useState(false);

  const { socket } = useSocket();
  const { channelId } = useParams();

  const handleRadioItemClick = (updatedChannelType: "text" | "voice") => {
    setSelectedChannelType(updatedChannelType);
    form.setValue("channelType", updatedChannelType);
  };

  const onSubmit = async (data: z.infer<typeof createChannelSchema>) => {
    console.log("Make db call to add channel", data);

    await createChannel(data, serverId, category._id);

    setOpen(false);

    socket.emit("create-channel", channelId);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background-primary p-0 rounded-sm w-[460px] flex flex-col gap-0">
        <DialogHeader className="flex text-left p-4">
          <DialogTitle className="text-header-primary text-xl leading-6 font-medium">
            Create Channel
          </DialogTitle>
          <DialogDescription className="text-header-secondary text-xs font-normal">
            in {category.categoryName}
          </DialogDescription>
        </DialogHeader>

        <div className="pl-4 pr-2 max-h-[680px] overflow-x-hidden overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="createChannelForm">
              {" "}
              <h2 className="text-header-secondary mb-2 text-xs font-bold uppercase tracking-wide">
                Channel Type
              </h2>
              <div role="radiogroup">
                <RadioItem
                  channelType="text"
                  onRadioItemClick={handleRadioItemClick}
                  selectedChannelType={selectedChannelType}
                />
                <RadioItem
                  channelType="voice"
                  onRadioItemClick={handleRadioItemClick}
                  selectedChannelType={selectedChannelType}
                />
              </div>
              <FormField
                name="channelName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="text-slate-300 w-full font-bold mb-5">
                    <FormLabel className="font-bold uppercase tracking-wide text-xs">
                      Channel Name
                      <span className="text-destructive pl-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        {selectedChannelType === "text" ? (
                          <Hash className="absolute text-text-normal top-3 left-2 h-4 w-4" />
                        ) : (
                          <Volume className="absolute text-text-normal top-3 left-2 h-4 w-4" />
                        )}
                        <Input
                          type="text"
                          {...field}
                          required
                          placeholder="new-channel"
                          className="placeholder:text-zinc-500 pl-7"
                          maxLength={100}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        </div>
        <div className="bg-modal-footer p-4 flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="min-h-[38px] h-[38px] min-w-[96px] flex items-center justify-center border-0 text-sm leading-4 py-0.5 px-4 rounded truncate"
          >
            Cancel
          </button>
          <button
            disabled={!form.formState.isValid}
            className="min-h-[38px] h-[38px] min-w-[96px] flex items-center justify-center border-0 text-sm leading-4 py-0.5 px-4 rounded truncate bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            form="createChannelForm"
          >
            Create Channel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
