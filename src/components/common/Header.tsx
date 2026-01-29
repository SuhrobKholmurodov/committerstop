import { Switcher, type VerifiedUser } from "@/components/common";
import UserDropdown from "./UserDropdown";
import { CircleQuestionMark } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Link } from "react-router-dom";

interface HeaderProps {
  countryName?: string;
  verifiedUser?: VerifiedUser | null;
  onLogout?: () => void;
  showBackButton?: boolean;
}

export const Header = ({
  countryName,
  verifiedUser = null,
  onLogout = () => {},
  showBackButton = false,
}: HeaderProps) => {
  const isHomePage = !countryName;

  return (
    <div
      id="header-section"
      className="flex items-center justify-between sm:flex-col-reverse sm:items-start mb-1"
    >
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Link
            to="/"
            className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            aria-label="Back to all countries"
          >
            ← Back
          </Link>
        )}

        {isHomePage ? (
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] font-bold sm:text-[18px] dark:text-gray-50 sm:text-center">
              Top GitHub Contributors Worldwide
            </h1>
            <Tippy
              interactive={true}
              content={
                <span className="text-sm text-gray-300 max-w-xs">
                  Explore the most active GitHub contributors by country. Click
                  on any country to see detailed rankings.
                </span>
              }
              placement="bottom"
            >
              <CircleQuestionMark className="mt-1 hover:cursor-pointer text-gray-600 dark:text-gray-300" />
            </Tippy>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] font-bold sm:text-[18px] dark:text-gray-50 sm:text-center">
              Active GitHub Users in {countryName}
            </h1>
            <Tippy
              interactive={true}
              content={
                <span className="text-sm text-gray-300 max-w-xs">
                  Showing the most active GitHub users in {countryName}. If
                  you're not in the list, set your location to '{countryName}'
                  in your GitHub profile. Rankings update approximately every 5
                  days.
                </span>
              }
              placement="bottom"
            >
              <CircleQuestionMark className="mt-1 hover:cursor-pointer text-gray-600 dark:text-gray-300" />
            </Tippy>
          </div>
        )}
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
