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
    getMembers(server._id).then((data) => {
      console.log(data);
      setServerMembersData(data);
    });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        serverMembersData={serverMembersData || { owner: "", members: [] }}
      />
    </div>
  );
}
