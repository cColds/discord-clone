import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

type AddServerModalType = {
  children: React.ReactNode;
};

const AddServerModal = ({ children }: AddServerModalType) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-background-primary p-0 rounded-sm w-[440px] max-h-[580px]">
        <DialogHeader className="px-4 pt-6">
          <DialogTitle className="text-2xl text-center text-header-primary tracking-normal">
            Create Your Server
          </DialogTitle>
          <DialogDescription className="text-header-secondary mt-2 text-center text-md leading-5">
            Your server is where you and your friends hang out. Make yours and
            start talking.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-hidden overflow-y-auto mt-6 pb-2 pr-2 pl-4 relative z-0 rounded">
          <button className="rounded-lg border-background-modifier-accent border mb-2 bg-background-primary flex items-center pointer w-full p-0 hover:bg-background-modifier-accent">
            <Image
              alt=""
              width={48}
              height={48}
              src="/images/icons/create-server.svg"
              className="ml-4 mr-2 my-2"
            />

            <p className="overflow-hidden text-ellipsis text-md font-bold leading-5">
              Create My Own
            </p>
            <Image
              alt=""
              width={20}
              height={20}
              src="/images/icons/caret.svg"
              className="ml-auto mr-4"
            />
          </button>
        </div>

        <div className="bg-background-secondary flex flex-col items-center p-4 overflow-x-hidden">
          <h2 className="mb-2 leading-6 text-xl font-bold text-header-primary">
            Have an invite already?
          </h2>
          <button className="border-0 px-4 py-0.5 h-[38px] min-w-[96px] min-h-[38px] w-full text-sm leading-4 rounded-[3px] bg-button-secondary-background hover:bg-button-secondary-background-hover focus-visible:border">
            Join a server
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddServerModal;
