import { TextOrVoiceChannel } from "@/types/server";
import Link from "next/link";
import { CreateInvite, Hash, Volume, Settings } from "../svgs";
import ActionTooltip from "../tooltip/ActionTooltip";

type ServerChannelProps = {
  channel: TextOrVoiceChannel;
  serverId: string;
};

const ServerChannel = ({ channel, serverId }: ServerChannelProps) => {
  return (
    <li>
      <div className="py-[1px] ml-2">
        <Link
          href={`/channels/servers/${serverId}/${channel._id}`}
          aria-label={`${channel.name} (${channel.type} channel)`}
          className="cursor-pointer py-1.5 px-2 rounded hover:bg-background-modifier-hover flex flex-col group"
        >
          <div className="flex justify-center items-center">
            <div className="mr-1.5" aria-label="Text icon">
              {channel.type === "text" ? (
                <Hash className="text-channel-icon w-5 h-5 block shrink-0" />
              ) : (
                <Volume className="text-channel-icon w-5 h-5 block shrink-0" />
              )}
            </div>

            <p
              className="text-md truncate text-channels-default leading-5 grow group-hover:text-interactive-hover"
              aria-hidden="true"
            >
              {channel.name}
            </p>

            <div className="flex items-center justify-center shrink-0">
              <ActionTooltip content="Create Invite">
                <button
                  className="ml-1 border-0 opacity-0 group-hover:opacity-100"
                  aria-label="Create Invite"
                >
                  <CreateInvite className="w-4 h-4 text-interactive-normal" />
                </button>
              </ActionTooltip>

              <ActionTooltip content="Edit Channel">
                <button
                  className="ml-1 border-0 opacity-0 group-hover:opacity-100"
                  aria-label="Edit Channel"
                >
                  <Settings className="w-4 h-4 text-interactive-normal" />
                </button>
              </ActionTooltip>
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
};

export default ServerChannel;