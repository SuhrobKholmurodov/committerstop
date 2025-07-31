import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Committer } from "@/types";
import { UserDialog } from "./UserDialog";

interface UserTableProps {
  users: Committer[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (username: string) => {
    setSelectedUser(username);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="relative overflow-x-auto">
        <Table className="rounded-lg w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center dark:bg-gray-900/20 bg-gray-50/20 backdrop-blur-lg sticky left-0">
                Rank
              </TableHead>
              <TableHead className="min-w-[200px]">User</TableHead>
              <TableHead className="text-center min-w-[100px]">
                Commits
              </TableHead>
              <TableHead className="text-center min-w-[100px]">
                Avatar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.username}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="text-center dark:bg-gray-900/20 bg-gray-50/20 backdrop-blur-lg font-medium sticky left-0">
                  {user.rank}
                </TableCell>
                <TableCell>
                  <button
                    className="text-blue-500 hover:underline cursor-pointer bg-transparent border-none p-0"
                    onClick={() => openDialog(user.username)}
                  >
                    {user.username}
                  </button>
                  <br />
                  <span className="text-sm text-gray-500 ml-1">
                    {user.realname && user.realname.length > 0
                      ? `(${user.realname})`
                      : "()"}
                  </span>
                </TableCell>
                <TableCell className="text-center">{user.commits}</TableCell>
                <TableCell className="text-center">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserDialog
          username={selectedUser}
          open={dialogOpen}
          key={selectedUser}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};
