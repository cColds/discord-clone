import { useEffect, useState } from "react";

import { MemberTableType, ServerType } from "@/types/server";
import { getMembers } from "@/lib/db/getMembers";
import { DataTable } from "./data-table/data-table";

type ServerSettingsMembersProps = {
  server: ServerType;
};

export default function ServerSettingsMembers({
  server,
}: ServerSettingsMembersProps) {
  const [serverMembersData, setServerMembersData] =
    useState<null | MemberTableType>(null);

  useEffect(() => {
    (async () => {
      const members = await getMembers(server._id);
      setServerMembersData(members);
    })();
  }, []);

  const handleUpdateMember = async () => {
    const updatedMembers = await getMembers(server._id);

    setServerMembersData(updatedMembers);
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        serverMembersData={serverMembersData || { owner: "", members: [] }}
        serverId={server._id}
        onUpdateMember={handleUpdateMember}
      />
    </div>
  );
}
