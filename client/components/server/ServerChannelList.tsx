"use client";

import { ServerType, TextOrVoiceChannel } from "@/types/server";
import Link from "next/link";
import { CreateInvite, Hash, Volume, Settings } from "../svgs";
import ActionTooltip from "../tooltip/ActionTooltip";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import CreateInviteModal from "../modals/server/CreateInviteModal";
import { createInvite } from "@/lib/db/createInvite";
import { useState, MouseEvent } from "react";

type ServerChannelListProps = {
  channel: TextOrVoiceChannel;
  server: ServerType;
};

const ServerChannelList = ({ channel, server }: ServerChannelListProps) => {
  const [invite, setInvite] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { channelId } = useParams();

  const handleCreateInvite = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const inviteCode = await createInvite(server._id, channel);

    setInvite(inviteCode);
    toggleInviteModal();
  };

  const toggleInviteModal = () => setInviteModalOpen(!inviteModalOpen);

  return (
    <li>
      <div className="py-[1px] ml-2">
        <Link
          href={`/channels/servers/${server._id}/${channel._id}`}
          aria-label={`${channel.name} (${channel.type} channel)`}
          className={cn(
            "cursor-pointer py-1.5 px-2 rounded hover:bg-background-modifier-hover flex flex-col group",
            {
              "bg-background-modifier-selected": channelId === channel._id,
              "hover:bg-background-modifier-selected":
                channelId === channel._id,
            }
          )}
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
              className={cn(
                "text-md truncate text-channels-default leading-5 grow group-hover:text-interactive-hover",
                {
                  "text-white": channelId === channel._id,
                  "group-hover:text-white": channelId === channel._id,
                }
              )}
              aria-hidden="true"
            >
              {channel.name}
            </p>

            <div className="flex items-center justify-center shrink-0">
              <CreateInviteModal
                server={server}
                channel={channel}
                inviteCode={invite}
                open={inviteModalOpen}
                onToggleOpen={toggleInviteModal}
              >
                <button
                  className="ml-1 border-0 opacity-0 group-hover:opacity-100"
                  aria-label="Create Invite"
                  onClick={handleCreateInvite}
                >
                  <CreateInvite className="w-4 h-4 text-interactive-normal" />
                </button>
              </CreateInviteModal>

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

export default ServerChannelList;
