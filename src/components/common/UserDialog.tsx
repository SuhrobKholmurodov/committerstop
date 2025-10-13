import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetGitHubUserByUsernameQuery } from "@/api/githubApi";
import { useVerifyUserGistQuery } from "@/api/verifyGistApi";
import { ArrowUpRight } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { useEffect, useState } from "react";
import type { Committer } from "@/types";
import UserVerificationDialog from "./UserVerificationDialog";

interface UserDialogProps {
  user: Committer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: (user: Committer) => void;
}

// Simplified VerifiedUser: only verification info
export interface VerifiedUser {
  username: string;
  gistUrl: string;
  verifiedAt: string;
}

export const UserDialog = ({
  user,
  open,
  onOpenChange,
  onVerified,
}: UserDialogProps) => {
  const {
    data: userInfo,
    error,
    isLoading,
  } = useGetGitHubUserByUsernameQuery(user.username, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: verificationData,
    isFetching: isCheckingVerification,
    refetch: refetchVerification,
    error: verificationError,
  } = useVerifyUserGistQuery({ username: user.username }, { skip: !open });

  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([]);

  // Load persisted verified users (if any)
  useEffect(() => {
    const stored = localStorage.getItem("verifiedUsers");
    if (stored) {
      try {
        setVerifiedUsers(JSON.parse(stored));
      } catch {
        setVerifiedUsers([]);
      }
    }
  }, []);

  // Re-check verification when dialog opens
  useEffect(() => {
    if (open) {
      refetchVerification?.();
    }
  }, [open, refetchVerification]);

  // When verification succeeds, add a simplified VerifiedUser entry
  useEffect(() => {
    if (verificationData?.verified) {
      const stored = localStorage.getItem("verifiedUsers");
      const parsed: VerifiedUser[] = stored ? JSON.parse(stored) : [];
      if (!parsed.find((u) => u.username === user.username)) {
        parsed.push({
          username: user.username,
          gistUrl: verificationData.gistUrl || "",
          verifiedAt: new Date().toISOString(),
        });

        localStorage.setItem("verifiedUsers", JSON.stringify(parsed));
        setVerifiedUsers(parsed);
      }
    }
  }, [verificationData, user.username]);

  const hasAnyLocallyVerified = verifiedUsers.length > 0;
  const isGloballyVerified = Boolean(verificationData?.verified);
  const showVerifyButton = !hasAnyLocallyVerified && !isGloballyVerified;
  const isVerified =
    isGloballyVerified ||
    verifiedUsers.some((u) => u.username === user.username);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md sm:max-w-[360px] rounded-md">
          <DialogHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-xl font-semibold">
              User info: {user.username}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="mt-4 min-h-[200px]">
            {isLoading && <LoadingSpinner />}
            {!isLoading && error && (
              <ErrorMessage
                title="Error loading data"
                message="Try refreshing the page."
                className="mt-10"
              />
            )}

            {userInfo && (
              <div className="space-y-4">
                <div className="flex items-center space-x-5">
                  <img
                    src={userInfo.avatar_url}
                    alt={userInfo.login}
                    className="w-20 h-20 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                      {userInfo.name || userInfo.login}
                    </h3>
                    <a
                      href={userInfo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 flex items-center gap-1 dark:text-blue-400 hover:underline mt-1 text-sm"
                    >
                      View GitHub Profile <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>

                {userInfo.bio && (
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    {userInfo.bio}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-6 text-center text-sm">
                  <div>
                    <span className="block text-2xl font-semibold text-gray-900 dark:text-white">
                      {userInfo.followers}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">
                      Followers
                    </p>
                  </div>
                  <div>
                    <span className="block text-2xl font-semibold text-gray-900 dark:text-white">
                      {userInfo.following}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">
                      Following
                    </p>
                  </div>
                  <div>
                    <span className="block text-2xl font-semibold text-gray-900 dark:text-white">
                      {userInfo.public_repos}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">
                      Repositories
                    </p>
                  </div>
                </div>

                {userInfo.location && (
                  <p className="text-center text-gray-600 dark:text-gray-400 italic">
                    Location: {userInfo.location}
                  </p>
                )}

                {isCheckingVerification && (
                  <p className="text-sm text-gray-500">
                    Checking verification status...
                  </p>
                )}
                {verificationError && (
                  <p className="text-sm text-red-500">
                    Verification check failed
                  </p>
                )}

                {showVerifyButton && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => setVerificationOpen(true)}>
                      It's me
                    </Button>
                  </div>
                )}

                {isVerified && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ Account is verified.
                  </p>
                )}
              </div>
            )}
          </DialogDescription>

          <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {user && (
        <UserVerificationDialog
          username={user.username}
          userRank={user.rank}
          lastRank={undefined}
          open={verificationOpen}
          onOpenChange={setVerificationOpen}
          onVerified={() => {
            onVerified(user);
            setVerificationOpen(false);
            onOpenChange(false);
          }}
        />
      )}
    </>
  );
};
