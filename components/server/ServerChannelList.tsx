"use client";

import { ServerType, TextOrVoiceChannel } from "@/types/server";
import Link from "next/link";
import { CreateInvite, Hash, Volume, Settings } from "@/components/svgs";
import ActionTooltip from "@/components/tooltip/ActionTooltip";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import CreateInviteModal from "@/components/modals/server/CreateInviteModal";
import { createInvite } from "@/lib/db/createInvite";
import { useState, MouseEvent } from "react";
import { UserType } from "@/types/user";
import EditChannelModal from "../modals/server/EditChannelModal";

type ServerChannelListProps = {
  channel: TextOrVoiceChannel;
  server: ServerType;
  user: UserType;
};

const ServerChannelList = ({
  channel,
  server,
  user,
}: ServerChannelListProps) => {
  const [invite, setInvite] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editChannelModalOpen, setEditChannelModalOpen] = useState(false);
  const { channelId } = useParams();

  const handleCreateInvite = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const inviteCode = await createInvite(server._id, channel);

    setInvite(inviteCode);
    toggleInviteModal();
  };

  const toggleInviteModal = () => setInviteModalOpen(!inviteModalOpen);

  const toggleEditChannelModal = () =>
    setEditChannelModalOpen(!editChannelModalOpen);

  return (
    <li>
      <div className="py-[1px] ml-2">
        <div
          className={cn(
            "cursor-pointer rounded hover:bg-background-modifier-hover flex flex-col group",
            {
              "bg-background-modifier-selected": channelId === channel._id,
              "hover:bg-background-modifier-selected":
                channelId === channel._id,
            }
          )}
        >
          <div className="flex items-center">
            <Link
              href={`/channels/servers/${server._id}/${channel._id}`}
              aria-label={`${channel.name} (${channel.type} channel)`}
              className={
                "grow cursor-pointer py-1.5 px-2 rounded flex group overflow-hidden"
              }
            >
              <div className="mr-1.5" aria-label="Text icon">
                {channel.type === "text" ? (
                  <Hash className="text-channel-icon w-5 h-5 block shrink-0" />
                ) : (
                  <Volume className="text-channel-icon w-5 h-5 block shrink-0" />
                )}
              </div>
              <p
                className={cn(
                  "text-md truncate text-channels-default leading-5 group-hover:text-interactive-hover",
                  {
                    "text-white": channelId === channel._id,
                    "group-hover:text-white": channelId === channel._id,
                  }
                )}
                aria-hidden="true"
              >
                {channel.name}
              </p>
            </Link>

            <div className="flex items-center justify-center shrink-0 pr-2">
              <CreateInviteModal
                server={server}
                channel={channel}
                inviteCode={invite}
                open={inviteModalOpen}
                onToggleOpen={toggleInviteModal}
              >
                <button
                  className="ml-1 py-1.5 border-0 opacity-0 focus-visible:outline-2 focus-visible:outline-light-blue-outline group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Create Invite"
                  onClick={handleCreateInvite}
                >
                  <ActionTooltip content="Create Invite">
                    <div>
                      <CreateInvite className="w-4 h-4 text-interactive-normal" />
                    </div>
                  </ActionTooltip>
                </button>
              </CreateInviteModal>

              {user.id === server.owner && (
                <ActionTooltip content="Edit Channel">
                  <button
                    className="py-1.5 ml-1 border-0 focus-visible:outline-2 focus-visible:outline-light-blue-outline opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label="Edit Channel"
                    onClick={toggleEditChannelModal}
                  >
                    <Settings className="w-4 h-4 text-interactive-normal" />
                  </button>
                </ActionTooltip>
              )}
            </div>
          </div>
        </div>
      </div>
      <EditChannelModal
        open={editChannelModalOpen}
        onToggleModal={toggleEditChannelModal}
        channel={channel}
        server={server}
        user={user}
      />
    </li>
  );
};

export default ServerChannelList;
