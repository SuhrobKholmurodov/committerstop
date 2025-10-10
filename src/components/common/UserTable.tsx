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
import { UserDialog, type VerifiedUser } from "./UserDialog";
import { CheckCircle } from "lucide-react";

interface UserTableProps {
  users: Committer[];
  onUserVerified: (user: Committer) => void;
  verifiedUsers: VerifiedUser[];
}

export const UserTable = ({
  users,
  onUserVerified,
  verifiedUsers,
}: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (user: Committer) => {
    setSelectedUser(user);
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
                    onClick={() => openDialog(user)}
                  >
                    {user.username}
                  </button>

                  {verifiedUsers.some((u) => u.username === user.username) && (
                    <CheckCircle
                      className="inline text-green-600 ml-1"
                      size={16}
                    />
                  )}

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
          user={selectedUser}
          open={dialogOpen}
          key={selectedUser.username}
          onOpenChange={setDialogOpen}
          onVerified={onUserVerified}
        />
      )}
    </>
  );
};
