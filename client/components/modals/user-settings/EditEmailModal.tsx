import { changeEmailSchema } from "@/lib/validations/changeEmail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { Input } from "@/components/ui/input";
import { useUser } from "@/app/providers/UserProvider";
import Image from "next/image";
import { updateEmail } from "@/lib/actions/settings/updateEmail";
import { getUser } from "@/lib/db/getUser";

type EditEmailModalProps = {
  children: React.ReactNode;
};

export default function EditEmailModal({ children }: EditEmailModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: "", password: "" },
  });

  const { user, setUser } = useUser();

  const onSubmit = async (data: z.infer<typeof changeEmailSchema>) => {
    if (!user?.id) {
      console.error("User id cannot be undefined");

      return;
    }

    const userEmail = await updateEmail(data, user.id);

    const hasFieldError = userEmail?.error;

    if (hasFieldError) {
      form.setError(hasFieldError.field === "email" ? "email" : "password", {
        type: "manual",
        message: hasFieldError.msg,
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
        <DialogHeader className="pb-6 pt-[75px] px-4 flex flex-col items-center relative">
          <Image
            src="/images/background/email-stamp.svg"
            width={180}
            height={140}
            alt=""
            className="absolute left-[140px] -top-[68px] select-none"
            draggable={false}
          />

          <h1 className="font-bold text-center text-header-primary text-2xl">
            Enter an email address
          </h1>

          <p className="text-header-secondary mt-2 text-md leading-5 text-center">
            Enter a new email address and your existing password.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="overflow-hidden px-4 pb-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-slate-300 w-full font-bold mb-5">
                    <FormLabel className="font-bold uppercase tracking-wide text-xs">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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
