import { useEffect, useState } from "react";
import { Switcher } from "@/components/common";
import {
  LogOut,
  User as UserIcon,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type VerifiedUser = {
  username: string;
  gistUrl: string;
  rank: string;
  rankMessage?: string;
};

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
              className="w-56 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-lg"
              align="end"
            >
              <DropdownMenuLabel className="text-gray-700 gap-2 flex items-center dark:text-gray-300">
                Verified User
                <ShieldCheck className="text-green-500" size={18} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  window.open(verifiedUser.gistUrl, "_blank", "noopener")
                }
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                <UserIcon size={16} /> View Gist <ArrowUpRight size={14} />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 cursor-pointer flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
};
