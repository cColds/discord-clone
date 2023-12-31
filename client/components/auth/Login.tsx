"use client";

import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { loginSchema } from "@/lib/validations/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      const res = await signIn("credentials", {
        redirect: false,
        ...data,
      });

      if (!res?.ok) {
        const errOpts = { type: "manual", message: res?.error || "" };
        form.setError("email", errOpts);
        form.setError("password", errOpts);
        return;
      }

      router.push("/");
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full max-w-[500px] min-h-[400px] bg-zinc-800 rounded-sm p-8"
      >
        <div className="text-center mb-5">
          <h1 className="text-2xl font-semibold">Welcome back!</h1>
          <p className="text-gray-400">
            We&apos;re so excited to see you again!
          </p>
        </div>

        <div className="flex flex-col w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-slate-300 w-full font-bold mb-5">
                <FormLabel className="font-bold uppercase tracking-wide text-xs">
                  Email
                  <span className="text-destructive pl-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="text-slate-300 w-full font-bold mb-5">
                <FormLabel className="font-bold uppercase tracking-wide text-xs">
                  Password
                  <span className="text-destructive pl-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} required />
                </FormControl>
                <FormMessage />
                <button
                  type="button"
                  className="mt-1 mb-5 mr-auto text-sky-400 text-sm hover:underline font-medium"
                >
                  Forgot your password?
                </button>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="text-white text-md mb-2"
            disabled={isPending}
          >
            Log In
          </Button>

          <div className="text-sm text-gray-400 mt-1">
            <span>Need an account?</span>
            <Link
              href="/register"
              className="mt-1 mb-5 ml-1 mr-auto text-sky-400 text-sm hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
