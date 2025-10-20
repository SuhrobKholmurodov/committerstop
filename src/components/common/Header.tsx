import { Switcher, type VerifiedUser } from "@/components/common";
import UserDropdown from "./UserDropdown";
import { CircleQuestionMark } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface HeaderProps {
  verifiedUser: VerifiedUser | null;
  onLogout: () => void;
}

export const Header = ({ verifiedUser, onLogout }: HeaderProps) => {
  return (
    <div
      id="header-section"
      className="flex items-center justify-between sm:flex-col-reverse sm:items-start mb-1"
    >
      <div className="flex items-center gap-2">
        <h1 className="text-[26px] font-bold sm:text-[18px] dark:text-gray-50 sm:text-center">
          Active GitHub Users in Tajikistan
        </h1>
        <Tippy
          interactive={true}
          content={
            <span className="text-sm text-gray-300 max-w-xs">
              This is a website that shows the most active GitHub users in
              Tajikistan. If you are not in the list, edit your location in your
              GitHub profile to 'Tajikistan', and then wait for the next update
              (updates occur approximately every 5 days).
            </span>
          }
          placement="bottom"
        >
          <CircleQuestionMark className="mt-1 hover:cursor-pointer text-gray-600 dark:text-gray-300" />
        </Tippy>
      </div>

      <div className="flex gap-3 items-center sm:justify-between sm:flex-row-reverse sm:w-full">
        <Switcher />
        {verifiedUser && (
          <UserDropdown verifiedUser={verifiedUser} onLogout={onLogout} />
        )}
      </div>
    </div>
  );
};
