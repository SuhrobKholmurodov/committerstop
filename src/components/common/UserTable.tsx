import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Committer } from "@/types/User";

interface UserTableProps {
  users: Committer[];
}

const UserTable = ({ users }: UserTableProps) => {
  return (
    <Table className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <TableCaption className="text-gray-700 dark:text-gray-400">
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
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <TableCell className="text-center font-medium">
              {user.rank}
            </TableCell>
            <TableCell>
              <a
                href={user.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {user.username}
              </a>
            </TableCell>
            <TableCell className="text-center">{user.commits}</TableCell>
            <TableCell className="text-center">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full mx-auto"
                loading="lazy"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
