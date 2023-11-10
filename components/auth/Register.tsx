"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/register";
import { z } from "zod";
import { register } from "@/lib/actions/register";
import { useTransition } from "react";
import { signIn } from "next-auth/react";

export default function Register() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", username: "" },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        const { email, password } = data;

        await register(data);
        await signIn("credentials", {
          redirect: true,
          callbackUrl: "/",
          email,
          password,
        });
      } catch (err) {
        if ((err as Error).message === "Email is already registered") {
          form.setError("email", {
            type: "manual",
            message: (err as Error).message,
          });
        } else {
          form.setError("username", {
            type: "manual",
            message: (err as Error).message,
          });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full max-w-[500px] min-h-[400px] bg-zinc-800 rounded-sm p-8"
      >
        <h1 className="text-2xl font-semibold mb-5 text-center">
          Create an account
        </h1>

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
            name="username"
            render={({ field }) => (
              <FormItem className="text-slate-300 w-full font-bold mb-5">
                <FormLabel className="font-bold uppercase tracking-wide text-xs">
                  Username
                  <span className="text-destructive pl-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} required />
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
            Continue
          </Button>

          <div className="text-sm text-gray-400 mt-1">
            <Link
              href="/login"
              className="mt-1 mb-5 mr-auto text-sky-400 text-sm hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
