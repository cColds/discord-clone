import { useUser } from "@/app/providers/UserProvider";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
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
import { updateUsername } from "@/lib/actions/settings/updateUsername";
import { getUser } from "@/lib/db/getUser";
import { changeUsernameSchema } from "@/lib/validations/changeUsername";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type EditUsernameModalProps = {
  children: React.ReactNode;
};

export default function EditUsernameModal({
  children,
}: EditUsernameModalProps) {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useUser();

  const form = useForm<z.infer<typeof changeUsernameSchema>>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: { username: user?.username || "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof changeUsernameSchema>) => {
    if (!user?.id) {
      console.error("User id cannot be undefined");

      return;
    }

    const updatedUsernameDoc = await updateUsername(data, user.id);

    const hasFieldError = updatedUsernameDoc?.error;
    if (hasFieldError) {
      form.setError(
        hasFieldError.field === "username" ? "username" : "password",
        { type: "manual", message: updatedUsernameDoc.error.msg }
      );
    } else {
      const updatedUser = await getUser(user?.id);

      if (updatedUser) setUser(updatedUser);
      setOpen(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background-primary p-0 rounded-sm w-[440px] max-h-[580px] flex flex-col gap-0">
        <DialogHeader className="py-6 px-4 flex flex-col items-center">
          <h1 className="font-bold text-center text-header-primary text-2xl">
            Change your username
          </h1>

          <p className="text-header-secondary mt-2 text-md leading-5 text-center">
            Enter a new username and your existing password.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="overflow-hidden px-4 pb-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="text-slate-300 w-full font-bold mb-5">
                    <FormLabel className="font-bold uppercase tracking-wide text-xs">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        required
                        maxLength={32}
                        className="p-2.5 h-10 lowercase bg-input-background text-md rounded-sm text-text-normal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-slate-300 w-full font-bold">
                    <FormLabel className="font-bold uppercase tracking-wide text-xs">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        required
                        maxLength={32}
                        className="p-2.5 h-10 lowercase bg-input-background text-md rounded-sm text-text-normal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="rounded-bl-sm rounded-br-sm shadow-elevation-low bg-modal-footer p-4 overflow-hidden flex justify-end gap-2">
              <button
                className="rounded-sm text-sm leading-4 py-0.5 px-4 hover:underline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <PrimaryButton
                className="min-w-[96px] min-h-[38px] h-[38px]"
                type="submit"
              >
                Done
              </PrimaryButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
