import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Toast } from "./Toast";

interface VerifiedUser {
  username: string;
  verifiedAt?: string;
}

interface Props {
  verifiedUser: VerifiedUser;
  onLogout: () => void;
}

export default function UserDropdown({ verifiedUser, onLogout }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setConfirmOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={`https://github.com/${verifiedUser.username}.png`}
                alt={verifiedUser.username}
              />
              <AvatarFallback>{verifiedUser.username[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {verifiedUser.username}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-xl rounded-lg backdrop-blur-sm"
          align="end"
        >
          <div className="flex items-center gap-2 px-2 py-2 mx-1.5 mt-1.5 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm">
            <div className="p-1 bg-white/20 rounded-full">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <span className="font-semibold tracking-wide text-white text-[14px]">
              Verified Account
            </span>
            <div className="ml-4 mt-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

          <DropdownMenuItem className="flex flex-col items-start p-2 text-gray-700 dark:text-gray-200 cursor-default group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-md mx-1.5 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-sm">
            <div className="flex items-start gap-2 w-full">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                <UserIcon
                  size={18}
                  className="text-blue-600 dark:text-blue-400 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-base bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                    Verified Since
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 p-1 rounded bg-gray-100 dark:bg-gray-800/90">
                  <Calendar
                    size={14}
                    className="text-blue-500 dark:text-blue-400"
                  />
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate">
                    {verifiedUser.verifiedAt
                      ? new Date(verifiedUser.verifiedAt).toLocaleDateString()
                      : "Not verified"}
                  </span>
                </div>
                {verifiedUser.verifiedAt && (
                  <div className="flex items-center gap-1.5 mt-0.5 p-1 rounded bg-gray-100 dark:bg-gray-800/90">
                    <Clock
                      size={14}
                      className="text-purple-500 dark:text-purple-400"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {new Date(verifiedUser.verifiedAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="cursor-pointer flex items-center gap-2 p-2 mx-1.5 mb-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 group"
          >
            <div className="p-1 bg-red-50 dark:bg-red-900/30 rounded-md transition-transform">
              <LogOut size={18} className="text-red-500" />
            </div>
            <span className="font-medium text-sm group-hover:text-red-500 transition-colors">
              Sign Out
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={confirmOpen}
        onOpenChange={(val) => {
          setConfirmOpen(val);
          if (!val) setDropdownOpen(false);
        }}
      >
        <DialogContent className="max-w-[300px] bg-white dark:bg-gray-900 rounded-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            "Are you sure you want to log out?"
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                onLogout();
                setConfirmOpen(false);
                Toast("success", "You have successfully logged out!");
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
