import { useVerifyUserGistQuery } from "@/api/verifyGistApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";

function generateToken() {
  return `commiters-tj-verify-${Math.random().toString(36).slice(2, 10)}`;
}

interface Props {
  username: string;
  userRank?: number;
  lastRank?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export default function UserVerification({
  username,
  userRank,
  lastRank,
  open,
  onOpenChange,
  onVerified,
}: Props) {
  const [token] = useState(generateToken);

  const { data, isFetching, refetch, error } = useVerifyUserGistQuery(
    { username, token },
    { skip: !username || !open }
  );

  let rankMessage = "";
  if (userRank && lastRank) {
    if (userRank > lastRank)
      rankMessage = `Вы опустились на ${userRank - lastRank} место.`;
    else if (userRank < lastRank)
      rankMessage = `Вы поднялись на ${lastRank - userRank} место.`;
    else rankMessage = "Ваша позиция не изменилась.";
  }

  if (data?.verified) {
    onVerified();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Проверка пользователя</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Сгенерированный токен для Gist:{" "}
          <code className="font-bold">{token}</code>
        </p>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Создайте <strong>публичный Gist</strong> с этим токеном в описании и
          нажмите «Проверить».
        </p>

        <div className="flex gap-2">
          <Button
            className="bg-blue-600 text-white"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Проверить
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </div>

        {isFetching && <p className="text-sm mt-2">Проверка...</p>}
        {error && (
          <p className="text-sm mt-2 text-red-500">
            Ошибка: {(error as { data?: string }).data}
          </p>
        )}
        {data?.verified && (
          <p className="text-sm mt-2 text-green-600">
            ✅ Аккаунт верифицирован! Gist:{" "}
            <a href={data.gistUrl} target="_blank" className="underline">
              {data.gistUrl}
            </a>
          </p>
        )}

        {rankMessage && (
          <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
            {rankMessage}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
