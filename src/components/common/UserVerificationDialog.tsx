import { useVerifyUserGistQuery } from "@/api/verifyGistApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { generateToken } from "@/utils";

interface UserVerificationDialogProps {
  username: string;
  userRank?: number;
  lastRank?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export default function UserVerificationDialog({
  username,
  userRank,
  lastRank,
  open,
  onOpenChange,
  onVerified,
}: UserVerificationDialogProps) {
  const [token, setToken] = useState(generateToken);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setToken(generateToken());
      setTimeLeft(300);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const { data, isFetching, refetch, error } = useVerifyUserGistQuery(
    { username, token },
    { skip: !username || !open }
  );

  let rankMessage = "";
  if (userRank && lastRank) {
    if (userRank > lastRank)
      rankMessage = `You dropped ${userRank - lastRank} place(s).`;
    else if (userRank < lastRank)
      rankMessage = `You rose ${lastRank - userRank} place(s).`;
    else rankMessage = "Your position has not changed.";
  }

  if (data?.verified) onVerified();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] rounded-md">
        <DialogHeader>
          <DialogTitle>User Verification</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-between">
          <span>Your token:</span>
          <span
            className={`font-mono text-xs px-2 py-1 rounded-md ${
              timeLeft < 60
                ? "text-red-500"
                : "text-blue-500 dark:text-blue-400"
            } transition-colors`}
          >
            refreshes in {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg mb-3">
          <code className="font-mono font-bold text-blue-600 dark:text-blue-400 break-all flex-1">
            {token}
          </code>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Create a <strong>public Gist</strong> with this token in the
          description and click "Verify".
        </p>

        <div className="flex gap-2">
          <Button
            className="bg-blue-600 text-white"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Verify
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

        {isFetching && <p className="text-sm mt-2">Verifying...</p>}
        {error && (
          <p className="text-sm mt-2 text-red-500">
            Error: {(error as { data?: string }).data}
          </p>
        )}
        {data?.verified && (
          <p className="text-sm mt-2 text-green-600">✅ Account verified!</p>
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
