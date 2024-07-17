"use client";

import { useSocket } from "@/app/providers/SocketProvider";
import { useUser } from "@/app/providers/UserProvider";
import { UploadIcon } from "@/components/svgs";
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
import { createServer } from "@/lib/actions/createServer";
import { cn } from "@/lib/utils";
import { createServerSchema } from "@/lib/validations/createServer";
import { toBase64 } from "@/utils/helpers/toBase64";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateServerContentType = {
  onModalChange: (mode: null | "Create Server" | "Join Server") => void;
  onToggleModal: () => void;
};

const CreateServerContent = ({
  onModalChange,
  onToggleModal,
}: CreateServerContentType) => {
  const [fileSelected, setFileSelected] = useState<string | false>(false);
  const [fileObject, setFileObject] = useState<undefined | File>();

  const { user } = useUser();
  const router = useRouter();
  const { socket } = useSocket();

  const form = useForm<z.infer<typeof createServerSchema>>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: `${user?.displayName}'s server`,
      icon: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof createServerSchema>) => {
    if (data.serverName.length > 100 || data.serverName.length < 2 || !user)
      return;

    const form = new FormData();
    form.append("serverName", data.serverName);
    if (fileObject) {
      form.append("file", fileObject);
    }

    try {
      const server = await createServer(form, user.id);
      onModalChange(null);
      onToggleModal();

      if (server) {
        const serverLink = `http://localhost:3000/channels/servers/${server._id}`;

        router.push(serverLink);

        socket.emit("create-server", user.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <DialogHeader className="px-4 pt-6">
        <DialogTitle className="text-2xl text-center text-header-primary tracking-normal">
          Customize Your Server
        </DialogTitle>
        <DialogDescription className="text-header-secondary mt-2 text-center text-md leading-5">
          Give your new server a personality with a name and an icon. You can
          always change it later.
        </DialogDescription>
      </DialogHeader>

      <div className="pr-2 pl-4 my-4 min-h-0 grow">
        <div className="pt-1 flex justify-center text-interactive-normal">
          <div className="h-20 w-20 relative">
            {fileSelected ? (
              <Image
                alt="Your icon"
                src={fileSelected}
                width={80}
                height={80}
                className="h-20 w-20 rounded-[80px] bg-background-secondary-alt object-cover"
              />
            ) : (
              <UploadIcon />
            )}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              aria-label="Upload a Server Icon"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer text-[0px]"
              form="createServer"
              name="icon"
              onChange={async (e) => {
                if (!e.target.files) {
                  console.log(`file ${e.target.files} is empty`);
                  return;
                }

                const file = e.target.files[0];

                try {
                  console.log({ file });
                  const result = (await toBase64(file)) as string;
                  setFileSelected(result);
                  setFileObject(file);
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="createServer">
            <FormField
              control={form.control}
              name="serverName"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="font-bold uppercase tracking-wide text-header-secondary text-xs">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="p-2.5 h-8 text-md w-full rounded-[3px] text-text-normal bg-input-background border-0 focus-visible:border-2"
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage className="italic text-text-danger text-xs tracking-wide" />
                </FormItem>
              )}
            />

            <div className="text-text-muted mt-2 pb-1 text-xs leading-4">
              By creating a server, you agree to Discord's
              <strong>
                <a
                  className="text-text-link hover:underline"
                  href="https://discord.com/guidelines"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Community Guidelines
                </a>
              </strong>
              .
            </div>
          </form>
        </Form>
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
          form="createServer"
        >
          Create
        </button>
      </div>
    </>
  );
};

export default CreateServerContent;
