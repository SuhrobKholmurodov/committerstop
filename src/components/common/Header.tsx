import { useEffect, useState } from "react";
import { Switcher, type VerifiedUser } from "@/components/common";
import UserDropdown from "./UserDropdown";

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
        {verifiedUser && (
          <UserDropdown
            verifiedUser={verifiedUser}
            onLogout={() => {
              localStorage.removeItem("verifiedUsers");
              setVerifiedUser(null);
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};
