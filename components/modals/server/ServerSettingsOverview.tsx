import { ServerType } from "@/types/server";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { serverSchema } from "@/lib/validations/serverSchema";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useTransition } from "react";
import Image from "next/image";
import { toBase64 } from "@/utils/helpers/toBase64";
import { updateServer } from "@/lib/actions/updateServer";
import { UserType } from "@/types/user";
import { useSocket } from "@/app/providers/SocketProvider";
import { cn } from "@/lib/utils";

type ServerSettingsOverviewProps = {
  server: ServerType;
  user: UserType;
};

const ServerSettingsOverview = ({
  server,
  user,
}: ServerSettingsOverviewProps) => {
  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: { icon: server.icon, serverName: server.serverName },
  });

  const [isPending, startTransition] = useTransition();
  const { socket } = useSocket();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | undefined>(
    server.icon
  );

  const onSubmit = async (data: z.infer<typeof serverSchema>) => {
    startTransition(async () => {
      if (data.serverName.length > 100 || data.serverName.length < 2) return;
      const form = new FormData();
      form.append("serverName", data.serverName);
      if (file) {
        form.append("file", file);
      }
      await updateServer({
        formData: form,
        serverId: server._id,
        userId: user.id,
      });
      socket.emit(
        "update-server",
        server.members.map((m) => m.id)
      );
    });
  };
  const formState = form.watch();
  const acronym = formState.serverName
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), "");

  const isAllowedToEditServer = user.id === server.owner;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    try {
      const result = (await toBase64(file)) as string;
      setFilePreview(result);
      setFile(file);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-header-primary mb-5 text-xl font-semibold">
        Server Overview
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-[35px] flex-col"
        >
          <div className="flex flex-wrap gap-2.5">
            <div className="flex flex-nowrap mb-2.5">
              <div className="flex justify-center flex-col mr-2.5">
                <div
                  className={cn(
                    "h-[100px] w-[100px] relative hover:opacity-80 group",
                    { "cursor-not-allowed": !isAllowedToEditServer }
                  )}
                >
                  {filePreview ? (
                    <Image
                      alt="Your icon"
                      src={filePreview}
                      width={100}
                      height={100}
                      className="h-[100px] w-[100px] rounded-[100px] bg-background-secondary-alt object-cover"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] shadow-lg bg-brand-500 group-hover:bg-brand-560 rounded-full relative leading-10">
                      <span
                        className="max-w-full pointer-events-none select-none absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden whitespace-nowrap text-[32px] leading-10"
                        aria-hidden={true}
                      >
                        {acronym}
                      </span>
                    </div>
                  )}
                  {isAllowedToEditServer && (
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      aria-label="Upload a Server Icon"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer text-[0px]"
                      name="icon"
                      onChange={handleFileChange}
                    />
                  )}
                </div>
                {filePreview && isAllowedToEditServer && (
                  <button
                    onClick={() => {
                      setFilePreview(undefined);
                      setFile(undefined);
                    }}
                    className="border-0 text-interactive-normal hover:text-interactive-hover text-sm font-bold mt-2.5"
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="ml-2.5">
                <p className="mb-2 text-header-secondary text-sm max-w-[180px]">
                  We recommend an image of at least 512x512 for the server.
                </p>

                <button
                  className="relative h-[38px] min-w-[96px] duration-200 hover:bg-primary-500 bg-transparent border-[1px] px-4 py-0.5 text-sm border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  disabled={isPending || !isAllowedToEditServer}
                >
                  Upload Image
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    aria-label="Upload a Server Icon"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer text-[0px] disabled:cursor-not-allowed"
                    name="icon"
                    onChange={handleFileChange}
                    disabled={isPending || !isAllowedToEditServer}
                  />
                </button>
              </div>
            </div>
            <FormField
              control={form.control}
              name="serverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold uppercase tracking-wide text-xs text-header-secondary truncate">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      maxLength={100}
                      className="disabled:cursor-not-allowed w-[320px] border-0 outline-0 focus-visible:outline-2 focus-visible:outline-light-blue-outline h-10 bg-input-background text-md rounded-sm placeholder:text-text-normal/50 placeholder:font-medium"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      disabled={isPending || !isAllowedToEditServer}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <button
            type="submit"
            className="disabled:cursor-not-allowed disabled:opacity-80 self-start bg-status-positive-background hover:bg-status-positive-background-hover active:bg-status-positive-background-active px-4 py-1 text-sm h-8 min-w-[60px] min-h-[32px] transition duration-200"
            disabled={isPending || !isAllowedToEditServer}
          >
            Save Changes
          </button>
        </form>
      </Form>

      {!isAllowedToEditServer && (
        <p className="mt-5 text-status-danger text-sm">
          You do not have permission to edit this server.
        </p>
      )}
    </div>
  );
};

export default ServerSettingsOverview;
