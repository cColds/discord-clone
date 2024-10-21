import { UserDms } from "@/types/user";

export const sortOpenDms = (dms: UserDms["dms"]) => {
  const dmsOpen = dms.filter((dm) => dm.open);
  const sortedDms = dmsOpen.sort((a, b) => {
    return (
      new Date(b.channel.lastMessageTimestamp).getTime() -
      new Date(a.channel.lastMessageTimestamp).getTime()
    );
  });

  return sortedDms;
};
