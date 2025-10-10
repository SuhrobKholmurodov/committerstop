import { useEffect, useState } from "react";
import { Switcher, type VerifiedUser } from "@/components/common";
import {
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Header = () => {
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("verifiedUsers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) setVerifiedUser(parsed[0]);
      } catch {
        setVerifiedUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("verifiedUsers");
    setVerifiedUser(null);
    window.location.reload();
  };

  return (
    <div
      id="header-section"
      className="flex items-center justify-between sm:flex-col-reverse sm:items-start mb-1"
    >
      <h1 className="text-3xl font-bold sm:text-[18px] dark:text-gray-50 sm:text-center">
        Active GitHub Users in Tajikistan
      </h1>

      <div className="flex gap-3 items-center sm:justify-between sm:flex-row-reverse sm:w-full">
        <Switcher />
        {verifiedUser ? (
          <DropdownMenu>
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
                  <ShieldCheck className="text-white" size={14} />
                </div>
                <span className="font-semibold tracking-wide text-white text-xs">
                  Verified Account
                </span>
                <div className="ml-auto">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem className="flex flex-col items-start p-2 text-gray-700 dark:text-gray-200 cursor-default group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-md mx-1.5 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-sm">
                <div className="flex items-start gap-2 w-full">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <UserIcon
                      size={14}
                      className="text-blue-600 dark:text-blue-400 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-xs bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                        Verified Since
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 p-1 rounded bg-white/50 dark:bg-gray-800/30">
                      <Calendar
                        size={10}
                        className="text-blue-500 dark:text-blue-400"
                      />
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate">
                        {verifiedUser.verifiedAt
                          ? new Date(
                              verifiedUser.verifiedAt
                            ).toLocaleDateString()
                          : "Not verified"}
                      </span>
                    </div>
                    {verifiedUser.verifiedAt && (
                      <div className="flex items-center gap-1.5 mt-0.5 p-1 rounded bg-white/30 dark:bg-gray-800/20">
                        <Clock
                          size={10}
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
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 p-2 mx-1.5 mb-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 group"
              >
                <div className="p-1 bg-red-50 dark:bg-red-900/30 rounded-md transition-transform">
                  <LogOut size={14} className="text-red-500" />
                </div>
                <span className="font-medium text-sm group-hover:text-red-500 transition-colors">
                  Sign Out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
};
