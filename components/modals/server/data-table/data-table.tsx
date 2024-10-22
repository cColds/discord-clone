"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member, MemberTableType } from "@/types/server";
import { format, formatDistance } from "date-fns";
import { useUser } from "@/app/providers/UserProvider";
import { UserType } from "@/types/user";
import ActionTooltip from "@/components/tooltip/ActionTooltip";
import Image from "next/image";
import { kickMember } from "@/lib/actions/kickMember";
import { useRouter } from "next/navigation";
import { useSocket } from "@/app/providers/SocketProvider";

type ColumnProps = {
  user: UserType | null;
  serverOwnerId: string;
  onKick: (userId: string) => void;
};

const columns = ({
  user,
  serverOwnerId,
  onKick,
}: ColumnProps): ColumnDef<Member>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Image
          src={row.original.avatar}
          width={32}
          height={32}
          alt={row.getValue("username")}
          className="rounded-full select-none"
          draggable={false}
        />

        <div>
          <div className="font-semibold">{row.original.displayName}</div>
          <div className="text-header-secondary text-xs">
            {row.getValue("username")}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const joined = formatDistance(
        new Date(row.getValue("createdAt")),
        new Date()
      );

      const title = format(
        new Date(row.getValue("createdAt")),
        "LLL d, y, h:mm a"
      );

      return (
        <ActionTooltip content={title} side="top">
          <div className="lowercase text-text-normal font-semibold">
            {joined} ago
          </div>
        </ActionTooltip>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.id)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                member.id === serverOwnerId || user?.id !== serverOwnerId
              }
              className="text-status-danger focus:bg-status-danger active:bg-status-danger/80 hover:bg-status-danger hover:text-white active:text-white"
              onClick={() => onKick(member.id)}
            >
              Kick {member.username}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                member.id === serverOwnerId || user?.id !== serverOwnerId
              }
              className="text-status-danger focus:bg-status-danger active:bg-status-danger/80 hover:bg-status-danger hover:text-white active:text-white"
            >
              Transfer Ownership
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type DataTable = {
  serverMembersData: MemberTableType;
  serverId: string;
  onUpdateMember: () => void;
};

export function DataTable({
  serverMembersData,
  serverId,
  onUpdateMember,
}: DataTable) {
  const { user } = useUser();
  const { socket } = useSocket();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({}); // todo: change state to members to kick ppl

  const handleKick = async (userId: string) => {
    const server = await kickMember({
      serverId,
      senderId: user?.id || "",
      recipientId: userId,
    });

    if (!server) return;
    onUpdateMember();
    socket.emit("update-server", server.members);
  };

  const table = useReactTable({
    data: serverMembersData.members,
    columns: columns({
      user,
      serverOwnerId: serverMembersData.owner,
      onKick: handleKick,
    }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="bg-zinc-dark p-4 rounded w-[500px]">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Search by username"
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} member(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
