"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { addFriendSchema } from "@/lib/validations/addFriend";
import { addFriend } from "@/lib/actions/addFriend";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/app/providers/SocketProvider";
import { getUserId } from "@/lib/db/getUserId";

export default function AddFriendSearchBar() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const { data: session } = useSession();
  const { socket } = useSocket();

  const form = useForm<z.infer<typeof addFriendSchema>>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: { recipientUsername: "" },
  });

  const onSubmit = async (data: z.infer<typeof addFriendSchema>) => {
    startTransition(async () => {
      const validUsernameLength =
        data.recipientUsername.length >= 2 &&
        data.recipientUsername.length <= 37;

      if (!validUsernameLength) {
        const errOpts = {
          type: "manual",
          message:
            "Hm, didn't work. Double check that the username is correct.",
        };
        form.setError("recipientUsername", errOpts);

        return;
      }

      try {
        const senderId = session?.user.id;
        if (!senderId) throw new Error("Your user id is invalid");

        const response = await addFriend(data, senderId);

        if (!response?.success) {
          form.setError("recipientUsername", {
            type: "manual",
            message: response?.message || "Unknown Error",
          });
          return;
        }

        form.reset();
        setSuccess(data.recipientUsername);

        const recipientId = await getUserId(data.recipientUsername);
        socket.emit("send-friend-request", {
          senderId,
          recipientId,
        });
      } catch (err) {
        console.error(err);
      }
    });
  };

  const error = form.formState.errors.recipientUsername;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => {
          form.clearErrors();
          setSuccess("");
        }}
        className={cn(
          "bg-background-tertiary rounded-md mt-4 px-3 h-12 flex items-center border-[1px] border-text-input-border focus-within:border-text-link",
          {
            "border-status-danger": error,
            "focus-within:border-status-danger": error,
            "focus-within:border-green-360": success,
            "border-green-360": success,
          }
        )}
      >
        <FormField
          control={form.control}
          name="recipientUsername"
          render={({ field }) => (
            <FormItem className="flex items-center py-[1px] grow">
              <FormControl>
                <input
                  type="text"
                  {...field}
                  maxLength={37}
                  className="disabled:opacity-50 disabled:cursor-not-allowed bg-transparent h-[30px] w-full border-0 mr-4 py-2 tracking-[.04em]"
                  aria-label="You can add friends with their Discord username."
                  placeholder="You can add friends with their Discord username."
                  autoComplete="off"
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <button
          disabled={!form.formState.isDirty || isPending}
          className="rounded-[3px] bg-primary border-0 text-sm py-1 px-4 truncate disabled:cursor-not-allowed disabled:opacity-50 min-h-[32px] h-8 min-w-[60px] [&:not(:disabled)]:hover:bg-brand-560 [&:not(:disabled)]:active:bg-brand-600"
        >
          Send Friend Request
        </button>
      </form>
      {error && (
        <p className="text-text-danger mt-2 text-sm">{error.message}</p>
      )}

      {success && (
        <p className="text-text-positive mt-2 text-sm">
          Success! Your friend request to <strong>{success}</strong> was sent.
        </p>
      )}
    </Form>
  );
}
