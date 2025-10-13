import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RefreshCw, Search, X } from "lucide-react";
import { Toast, Switcher, type VerifiedUser } from "@/components/common";
import type { Mode, SortOption } from "@/types";
import { useSearchParams } from "react-router-dom";

interface FilterBarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: () => Promise<any>;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  verifiedUsers: VerifiedUser[];
}

export const FilterBar = ({
  mode,
  setMode,
  refetch,
  sortBy,
  setSortBy,
  verifiedUsers,
}: FilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [inputValue, setInputValue] = useState(urlSearch);
  const [showStickySwitcher, setShowStickySwitcher] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const urlSort = searchParams.get("sort") as SortOption;
  useEffect(() => {
    if (urlSort && urlSort !== sortBy) setSortBy(urlSort);
  }, [urlSort, sortBy, setSortBy]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSearch = () => setInputValue("");

  const handleRefetch = async () => {
    setIsRefreshing(true);
    try {
      const result = await refetch();
      if ("error" in result) {
        Toast("error", "Error updating data");
      } else if ("data" in result) {
        Toast("success", "Data updated successfully");
      } else {
        Toast("info", "Update completed");
      }
    } catch {
      Toast("error", "Error updating data");
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  return (
    <div className="mb-6 py-2 sticky top-0 z-20 flex sm:flex-col flex-row items-center w-full justify-between sm:gap-4 backdrop-blur-lg rounded-md">
      <div className="flex items-center gap-2 sm:gap-4 sm:w-full">
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
              className="cursor-pointer select-none rounded-md px-5 sm:px-4 py-2 sm:py-4
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
        <button
          onClick={handleRefetch}
          className="w-10 ml-3 sm:ml-0 h-10 rounded transition 
             hover:scale-110 active:scale-95"
        >
          <RefreshCw
            className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
              isRefreshing ? "animate-spinOnce" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        {verifiedUsers.length > 0 && (
          <div className="flex items-center gap-1">
            {verifiedUsers[0].direction === "up" && (
              <span className="text-green-500 font-medium">↑</span>
            )}
            {verifiedUsers[0].direction === "down" && (
              <span className="text-red-500 font-medium">↓</span>
            )}
            <span>{verifiedUsers[0].rankMessage}</span>
          </div>
        )}
      </div>

      <div className="flex sm:flex-col sm:w-full items-center gap-2">
        <Select
          value={sortBy}
          onValueChange={(val) => {
            setSortBy(val as SortOption);
            const newParams = new URLSearchParams(searchParams);
            newParams.set("sort", val);
            setSearchParams(newParams);
          }}
        >
          <SelectTrigger className="py-5 h-[42px] sm:w-full text-black dark:text-white border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-900">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 text-black dark:text-white dark:bg-gray-900/90">
            <SelectItem className="hover:cursor-pointer" value="commits-desc">
              Commits (High → Low)
            </SelectItem>
            <SelectItem className="hover:cursor-pointer" value="commits-asc">
              Commits (Low → High)
            </SelectItem>
            <SelectItem
              className="hover:cursor-pointer"
              value="alphabetical-asc"
            >
              Alphabetical (A → Z)
            </SelectItem>
            <SelectItem
              className="hover:cursor-pointer"
              value="alphabetical-desc"
            >
              Alphabetical (Z → A)
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="relative sm:w-full ml-0 sm:ml-auto flex items-center gap-1 sm:gap-0">
          <Input
            type="text"
            placeholder="Search by username..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-[42px] px-10 py-4 sm:py-5 border border-gray-300 dark:border-gray-700 
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
    </div>
  );
};
