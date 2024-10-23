import { useSocket } from "@/app/providers/SocketProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { deleteServer } from "@/lib/actions/deleteServer";
import { deleteServerSchema } from "@/lib/validations/deleteServerSchema";
import { ServerType } from "@/types/server";
import { UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DeleteServerModalProps = {
  open: boolean;
  toggleModal: (open: boolean) => void;
  server: ServerType;
  user: UserType;
};

export default function DeleteServerModal({
  open,
  toggleModal,
  server,
  user,
}: DeleteServerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof deleteServerSchema>>({
    resolver: zodResolver(deleteServerSchema),
    defaultValues: { serverName: "" },
  });
  const router = useRouter();
  const { socket } = useSocket();

  const isOwner = user.id === server.owner;

  const onSubmit = async (data: z.infer<typeof deleteServerSchema>) => {
    if (data.serverName !== server.serverName) {
      form.setError("serverName", {
        type: "custom",
        message: "You didn't enter the server name correctly",
      });
      return;
    }

    try {
      setIsLoading(true);
      await deleteServer({
        formData: data,
        userId: user.id,
        serverId: server._id,
      });
      router.push("/");
      socket.emit(
        "update-server",
        server.members.map((m) => m.id)
      );
    } catch (err) {
      console.error(err);
      form.setError("serverName", {
        type: "custom",
        message: err,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        toggleModal(open);
        console.log("reset!");
        form.reset();
      }}
      open={open}
    >
      <DialogContent
        removeCloseButton={true}
        className="rounded bg-background-primary p-0 w-[440px] max-h-[720px] min-h-[200px]"
      >
        <DialogHeader className="px-4 pt-4 overflow-hidden text-left">
          <DialogTitle className="font-bold text-header-primary text-xl">
            Delete &apos;{server.serverName}&apos;
          </DialogTitle>

          <DialogDescription className="text-header-secondary mt-2 text-md leading-5">
            Are you sure you want to delete <strong>{server.serverName}</strong>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="delete-server-form">
            <FormField
              name="serverName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="text-slate-300 w-full font-bold mb-5 px-4">
                  <FormLabel className="font-bold uppercase tracking-wide text-xs">
                    Enter Server Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isLoading || !isOwner}
                        type="text"
                        {...field}
                        className="disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-zinc-500 pl-2"
                        maxLength={100}
                        autoComplete="off"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {!isOwner && (
                    <p className="font-normal text-sm text-status-danger">
                      You do not have permission to delete this server.
                    </p>
                  )}
                </FormItem>
              )}
            ></FormField>
          </form>
        </Form>

        <DialogFooter className="bg-background-secondary p-4">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="hover:underline text-sm"
              onClick={() => {
                toggleModal(false);
                form.reset();
              }}
            >
              Cancel
            </button>
            <button
              className="disabled:cursor-not-allowed disabled:opacity-50 font-semibold bg-button-danger-background hover:bg-button-danger-background-hover rounded active:bg-button-danger-background-active border-0 text-sm px-4 py-0.5 h-[38px] min-w-[96px]"
              type="submit"
              form="delete-server-form"
              disabled={isLoading || !isOwner}
            >
              Delete Server
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
