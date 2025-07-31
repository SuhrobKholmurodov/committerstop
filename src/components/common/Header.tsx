import { Switcher } from "@/components/common";

export const Header = () => (
    <div id="header-section" className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold sm:text-[18px] dark:text-gray-50 sm:text-center">
            Active GitHub Users in Tajikistan
        </h1>
        <Switcher />
    </div>
);

