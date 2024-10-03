"use client";

import { useSocket } from "@/app/providers/SocketProvider";
import { useUser } from "@/app/providers/UserProvider";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { joinServer } from "@/lib/actions/joinServer";
import { cn } from "@/lib/utils";
import { joinServerSchema } from "@/lib/validations/joinServer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";

import { useForm } from "react-hook-form";
import { z } from "zod";

type JoinServerContentProps = {
  onModalChange: (mode: null | "Create Server" | "Join Server") => void;
  onToggleModal: () => void;
};

const JoinServerContent = ({
  onModalChange,
  onToggleModal,
}: JoinServerContentProps) => {
  const { user } = useUser();

  const form = useForm<z.infer<typeof joinServerSchema>>({
    resolver: zodResolver(joinServerSchema),
    defaultValues: {
      invite: "",
    },
  });

  const router = useRouter();
  const { socket } = useSocket();

  const onSubmit = async (data: z.infer<typeof joinServerSchema>) => {
    const inviteCode = data.invite;

    if (!user) {
      console.error("Can't join a server with an unknown account");
      return;
    }

    try {
      const serverToJoin = await joinServer(data, user);

      if (serverToJoin) {
        const channelInvite = serverToJoin.invites.find(
          (invite) => invite.code === inviteCode
        );

        const serverLink = `/channels/servers/${serverToJoin._id}/${
          channelInvite?.channel.id || ""
        }`;
        onToggleModal();

        router.push(serverLink);

        socket.emit("join-server", user.id, serverToJoin.members);
      } else {
        form.setError("invite", {
          type: "custom",
          message: "Please enter a valid invite link or invite code",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <DialogHeader className="px-4 pt-6">
        <DialogTitle className="text-2xl text-center text-header-primary tracking-normal">
          Join a Server
        </DialogTitle>
        <DialogDescription className="text-header-secondary mt-2 text-center text-md leading-5">
          Enter an invite below to join an existing server
        </DialogDescription>
      </DialogHeader>

      <div className="pr-2 pl-4 my-4 min-h-0 grow">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="joinServer"
            className="mb-4"
          >
            <FormField
              control={form.control}
              name="invite"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="font-bold uppercase tracking-wide text-header-secondary text-xs">
                    Invite Link
                    <span className="text-destructive pl-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="p-2.5 h-10 text-md w-full rounded-[3px] text-text-normal bg-input-background border-0 focus-visible:border-2"
                      maxLength={100}
                      placeholder="hTKzmak"
                    />
                  </FormControl>
                  <FormMessage className="italic text-text-danger text-xs tracking-wide" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div>
          <h2 className="font-bold uppercase tracking-wide text-interactive-normal text-xs mb-2">
            Invites should look like
          </h2>

          <div className="text-sm leading-[18px] text-header-primary">
            hTKzmak
          </div>
        </div>
      </div>
      <div className="bg-background-secondary flex items-stretch justify-between p-4">
        <button
          className="py-0.5 px-1 bg-transparent text-sm leading-4 select-none"
          onClick={() => onModalChange(null)}
        >
          Back
        </button>
        <button
          className={cn(
            "border-0 py-4 h-[38px] min-w-[96px] w-[96px] min-h-[38px] text-sm leading-4 rounded-[3px] bg-brand-500 hover:bg-brand-560 focus-visible:border flex justify-center items-center font-bold disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-brand-500"
          )}
          disabled={!form.formState.isValid}
          form="joinServer"
        >
          Join Server
        </button>
      </div>
    </>
  );
};

export default JoinServerContent;
