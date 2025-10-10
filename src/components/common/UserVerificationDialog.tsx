import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  useVerifyUserGistQuery,
  type VerifyGistResponse,
} from "@/api/verifyGistApi";

interface Props {
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
}

function generateToken() {
  return `commiters-tj-verify-${Math.random().toString(36).slice(2, 10)}`;
}

export default function UserVerificationDialog({
  username,
  open,
  onOpenChange,
  onVerified,
}: Props) {
  const [token] = useState(generateToken);

  const { data, isFetching, refetch, error } = useVerifyUserGistQuery(
    { username, token },
    { skip: !open }
  );

  const handleVerify = async () => {
    try {
      const res = await refetch();
      let verified = Boolean(data?.verified);

      if (res && typeof res === "object" && "data" in res) {
        const response = (res as { data?: VerifyGistResponse }).data;
        if (response?.verified) verified = true;
      }
      if (verified) {
        onVerified?.();
        onOpenChange(false);
      }
    } catch (err) {
      console.error("Verification refetch failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-[360px] rounded-md">
        <DialogHeader>
          <DialogTitle>Verify GitHub account: {username}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-4 space-y-3">
          <p>
            Сгенерированный токен: <code className="font-bold">{token}</code>
          </p>
          <p>
            Создайте <strong>публичный Gist</strong> с этим токеном в описании.
            После этого нажмите кнопку "Проверить".
          </p>
          {isFetching && <p>Проверка...</p>}
          {error && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <p className="text-red-500">Ошибка: {(error as any).data}</p>
          )}
          {data?.verified && (
            <p className="text-green-600 flex items-center gap-1">
              Verified <CheckCircle size={18} />
            </p>
          )}
        </DialogDescription>
        <DialogFooter className="pt-4">
          <Button
            onClick={handleVerify}
            disabled={isFetching || data?.verified}
          >
            Проверить
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
