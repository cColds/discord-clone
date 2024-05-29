import Image from "next/image";

const NoTextChannels = () => {
  return (
    <div className="grow">
      <div className="w-full h-full max-w-[440px] mx-auto flex items-center justify-center flex-nowrap flex-col">
        <Image
          src="/images/icons/no-text-channel.svg"
          width={272}
          height={272}
          className="shrink-0 mb-10 select-none"
          alt=""
          draggable="false"
        />

        <div className="shrink-0">
          <h2 className="leading-[22px] text-[17px] uppercase text-center text-text-muted font-bold">
            No Text Channels
          </h2>
          <p className="text-md leading-5 text-center text-text-muted mt-2">
            You find yourself in a strange place. You don't have access to any
            text channels, or there are none in this server.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoTextChannels;
