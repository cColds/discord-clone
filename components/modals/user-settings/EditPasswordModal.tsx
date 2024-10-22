import { useUser } from "@/app/providers/UserProvider";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { updatePassword } from "@/lib/actions/settings/updatePassword";
import { getUser } from "@/lib/db/getUser";
import { changePasswordSchema } from "@/lib/validations/changePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditPasswordModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", newPassword: "", confirmNewPassword: "" },
  });

  const { user, setUser } = useUser();

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    if (!user?.id) return;

    const updatedDoc = await updatePassword(data, user.id);

    if (updatedDoc?.error) {
      form.setError("password", {
        type: "manual",
        message: updatedDoc.error.msg,
      });
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
        <DialogHeader className="py-6 px-4 flex flex-col items-center relative">
          <DialogTitle className="font-bold text-center text-header-primary text-2xl">
            Update your password
          </DialogTitle>

          <DialogDescription className="text-header-secondary mt-2 text-md leading-5 text-center">
            Enter your current password and a new password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="overflow-hidden px-4 pb-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full font-bold">
                    <FormLabel className="font-bold uppercase tracking-wide text-xs text-header-secondary">
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

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="w-full font-bold mt-4">
                    <FormLabel className="font-bold uppercase tracking-wide text-xs text-header-secondary">
                      New Password
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

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="w-full font-bold  mt-4">
                    <FormLabel className="font-bold uppercase tracking-wide text-xs text-header-secondary">
                      Confirm New Password
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
