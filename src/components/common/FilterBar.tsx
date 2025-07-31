import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Switcher } from "@/components/common";
import type { Mode } from "@/types";
import { useSearchParams } from "react-router-dom";

interface FilterBarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const FilterBar = ({ mode, setMode }: FilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(urlSearch);
  const [showStickySwitcher, setShowStickySwitcher] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);

      if (inputValue.trim()) newParams.set("search", inputValue.trim());
      else newParams.delete("search");

      setSearchParams(newParams);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, searchParams, setSearchParams]);

  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const header = document.getElementById("header-section");
    const onScroll = () => {
      if (!header) return;
      setShowStickySwitcher(header.getBoundingClientRect().bottom <= 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onModeChange = (newMode: Mode) => {
    setMode(newMode);

    const newParams = new URLSearchParams(searchParams);
    if (newMode === "commits") newParams.delete("mode");
    else newParams.set("mode", newMode);

    setSearchParams(newParams);
  };

  const handleClearSearch = () => setInputValue("");

  return (
    <div className="mb-6 py-2 sticky top-0 z-20 flex sm:flex-col flex-row items-center w-full justify-between sm:gap-4 backdrop-blur-lg rounded-md">
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(val) => val && onModeChange(val as Mode)}
        className="inline-flex rounded-lg bg-gray-200 sm:w-full dark:bg-gray-800 p-2"
      >
        {["commits", "contributions", "all"].map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={value}
            className="cursor-pointer select-none rounded-md px-5 sm:px-8 py-2
              text-gray-700 dark:text-gray-300
              data-[state=on]:bg-blue-600 dark:data-[state=on]:bg-blue-600 bg-gray-300 dark:bg-gray-900 data-[state=on]:text-white
              transition-colors ease-in-out
              hover:bg-blue-500 hover:text-white"
          >
            {value === "commits"
              ? "Commits"
              : value === "contributions"
              ? "Contributions"
              : "All"}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="relative sm:w-full ml-0 sm:ml-auto flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search by username..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-[42px] px-10 py-4 sm:py-5 border-2 border-gray-300 dark:border-gray-700 
            rounded-lg shadow-sm
            focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
            hover:border-blue-400 hover:shadow-lg
            transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] 
            bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
            hover:bg-white dark:hover:bg-gray-900
            focus:bg-white dark:focus:bg-gray-900
            placeholder-gray-400 dark:placeholder-gray-500
            text-gray-800 dark:text-gray-200
            outline-none"
        />
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        {inputValue && (
          <X
            size={18}
            onClick={handleClearSearch}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500 transition-colors hover:scale-110"
          />
        )}
        <div
          className={`transition-all duration-300 ease-in-out transform 
            ${
              showStickySwitcher
                ? "max-w-[50px] opacity-100 translate-y-0"
                : "max-w-0 opacity-0 -translate-y-2 overflow-hidden"
            }`}
        >
          <Switcher />
        </div>
      </div>
    </div>
  );
};
