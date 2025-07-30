import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserDialog from "./UserDialog";
import type { Committer } from "@/types";

interface UserTableProps {
  users: Committer[];
}

const UserTable = ({ users }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (username: string) => {
    setSelectedUser(username);
    setDialogOpen(true);
  };

  return (
    <>
      <Table className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <TableCaption>
          Список активных GitHub пользователей из Таджикистана
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Ранг</TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead className="text-center">Коммиты</TableHead>
            <TableHead className="text-center">Аватар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.username}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="text-center font-medium">
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

      {selectedUser && (
        <UserDialog
          username={selectedUser}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};

export default UserTable;
