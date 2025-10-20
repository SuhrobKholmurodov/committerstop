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
import { useReward } from "react-rewards";
import { CheckIcon, ClipboardIcon } from "lucide-react";

interface UserVerificationDialogProps {
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export default function UserVerificationDialog({
  username,
  open,
  onOpenChange,
  onVerified,
}: UserVerificationDialogProps) {
  const [token] = useState(() => generateToken());
  const [timeLeft, setTimeLeft] = useState(300);
  const [copied, setCopied] = useState(false);

  const { reward } = useReward("confettiReward", "confetti", {
    startVelocity: 10,
    elementSize: 5,
  });

  const { data, isFetching, refetch, error } = useVerifyUserGistQuery(
    { username, token },
    { skip: !username || !open }
  );

  useEffect(() => {
    if (open && username && !data?.verified) {
      const timer = setTimeout(() => {
        refetch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, username, data?.verified, refetch]);

  useEffect(() => {
    if (open && username) {
      refetch();
    }
  }, [open, username, token, refetch]);

  useEffect(() => {
    if (open) {
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(300);
      setCopied(false);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (data?.verified) {
      onVerified();
    }
  }, [data, onVerified]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true);
      reward();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleVerify = () => {
    refetch();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      aria-labelledby="user-verification-title"
      aria-modal="true"
    >
      <DialogContent className="max-w-[430px] sm:max-w-[340px] rounded-md p-6 bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
        <DialogHeader>
          <DialogTitle
            id="user-verification-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            User Verification
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>Your token:</span>
          <span
            className={`font-mono text-xs px-3 py-1 rounded-md ${
              timeLeft < 60
                ? "bg-red-500 text-white animate-pulse"
                : "bg-blue-500 text-white"
            }`}
            aria-live="polite"
            aria-atomic="true"
            aria-relevant="text"
          >
            Refreshes in {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-1 mb-4">
          <div
            className="flex-1 bg-gray-100 dark:bg-gray-800 sm:px-2 sm:py-1 px-4 py-3 rounded-lg shadow-inner transition-colors break-words"
            aria-label={`Verification token: ${token}`}
            tabIndex={0}
          >
            <code className="font-mono font-semibold text-blue-600 dark:text-blue-400 select-all">
              {token}
            </code>
          </div>
          <div className="relative flex items-center">
            <span id="confettiReward" />
            <button
              onClick={handleCopy}
              aria-label={copied ? "Token copied" : "Copy token"}
              className="p-[14px] sm:p-[6] rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition disabled:cursor-default disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              disabled={copied}
              aria-live="polite"
              title={copied ? "Copied!" : "Copy token"}
              type="button"
            >
              {copied ? (
                <CheckIcon
                  className="w-5 h-5 text-green-600"
                  aria-hidden="true"
                />
              ) : (
                <ClipboardIcon
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          Create{" "}
          <strong>
            <span>
              <a
                href={`https://gist.github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline
                hover:text-blue-800"
              >
                public Gist
              </a>
            </span>
          </strong>{" "}
          with this token in the description and click{" "}
          <span className="font-semibold">Verify</span>.
        </p>

        <div className="flex gap-3 justify-end mb-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onClick={handleVerify}
            disabled={isFetching}
            type="button"
          >
            {isFetching ? "Verifying..." : "Verify"}
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>

        {error && (
          <p
            className="text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            Error: {(error as { data?: string }).data || "Verification failed."}
          </p>
        )}

        {data?.verified && (
          <p
            className="text-sm text-green-600"
            role="status"
            aria-live="polite"
          >
            ✅ Account verified!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
