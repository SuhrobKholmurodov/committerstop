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
import { ShieldCheck } from "lucide-react";

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
            {users.map((user) => {
              const verified = verifiedUsers.some(
                (v) => v.username === user.username
              );
              return (
                <TableRow
                  key={user.username}
                  className={`transition-all duration-200 ${
                    verified
                      ? "bg-gradient-to-r from-emerald-500/10 to-teal-100/10 dark:from-emerald-950/30 dark:to-teal-950/30 border-l-4 border-l-emerald-500 border-r border-r-transparent"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <TableCell className="text-center sticky left-0 backdrop-blur-lg font-medium">
                    {user.rank}
                  </TableCell>

                  <TableCell className="flex flex-col items-start gap-2">
                    <button
                      className={`cursor-pointer flex gap-2 text-blue-500 bg-transparent border-none`}
                      onClick={() => openDialog(user)}
                    >
                      {user.username}
                      {verified && (
                        <ShieldCheck className="text-emerald-500" size={18} />
                      )}
                    </button>
                    <span className="text-sm text-gray-500">
                      {user.realname && user.realname.length > 0
                        ? `(${user.realname})`
                        : "()"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">{user.commits}</TableCell>

                  <TableCell className="text-center">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.username}
                      className={`w-10 h-10 rounded-full mx-auto border-2 ${
                        verified
                          ? "border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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
