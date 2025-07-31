import { useState, useMemo, useEffect } from "react";
import { useGetTajikistanUsersQuery } from "../api/committersApi";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { Committer, Mode } from "@/types";
import { Helmet } from "react-helmet-async";
import { ErrorMessage, LoadingSpinner, UserTable } from "@/components/common";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlMode = searchParams.get("mode");
  const urlSearch = searchParams.get("search");
  const [mode, setMode] = useState<Mode>((urlMode as Mode) || "commits");
  const [inputValue, setInputValue] = useState(urlSearch || "");
  const [search, setSearch] = useState(urlSearch || "");
  const [localData, setLocalData] = useState<Committer[]>([]);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  const { data, error, isFetching } = useGetTajikistanUsersQuery(mode, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (mode && mode !== "commits") newParams.set("mode", mode);
    if (search) newParams.set("search", search);
    setSearchParams(newParams);
  }, [mode, search, setSearchParams]);

  useEffect(() => {
    setLocalData([]);
    setIsTabSwitching(true);
  }, [mode]);

  useEffect(() => {
    if (data) {
      setLocalData(data);
      setIsTabSwitching(false);
    }
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(urlSearch || "");
    setSearch(urlSearch || "");
  }, [urlSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearch("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams);
  };

  const filteredUsers = useMemo(() => {
    if (!localData) return [];
    if (!search.trim()) return localData;
    return localData.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [localData, search]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Helmet>
        <title>Most active GitHub users in Tajikistan</title>
      </Helmet>

      <h1 className="text-3xl font-bold sm:text-[14px] sm:text-center mb-4">
        Активные GitHub пользователи Таджикистана
      </h1>

      <div className="mb-6 sticky top-0 z-20 flex sm:flex-col-reverse flex-row items-center w-full justify-between sm:gap-4 dark:bg-gray-900/70 backdrop-blur-lg p-2 rounded-md">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(val) => val && setMode(val as Mode)}
          className="inline-flex rounded-lg bg-gray-200 sm:w-full dark:bg-gray-800 p-2"
        >
          {["commits", "contributions", "all"].map((value) => (
            <ToggleGroupItem
              key={value}
              value={value}
              aria-label={value}
              className="cursor-pointer select-none rounded-md px-5 sm:px-8 py-2
                text-gray-700 dark:text-gray-300
                data-[state=on]:bg-blue-600 bg-gray-300 data-[state=on]:text-white
                transition-colors duration-300 ease-in-out
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

        <div className="relative sm:w-full ml-0 sm:ml-auto">
          <Input
            type="text"
            placeholder="Поиск по имени пользователя..."
            value={inputValue}
            onChange={handleInputChange}
            className="h-[42px] px-10 py-4 sm:py-5 border-2 border-gray-300 dark:border-gray-700 
              rounded-lg shadow-sm
              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
              hover:border-blue-400 hover:shadow-lg
              transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] 
              bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
              hover:bg-white dark:hover:bg-gray-900
              focus:bg-white dark:focus:bg-gray-900
              placeholder-gray-400 dark:placeholder-gray-500
              text-gray-800 dark:text-gray-200
              outline-none"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-300"
          />
          {inputValue && (
            <X
              size={18}
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-300 hover:scale-110 transform"
            />
          )}
        </div>
      </div>

      {(isFetching || isTabSwitching) && <LoadingSpinner />}

      {error && (
        <ErrorMessage
          title="Error loading data"
          message="Try refreshing the page."
          className="mt-10"
        />
      )}

      {!error &&
        filteredUsers.length === 0 &&
        !(isFetching || isTabSwitching) && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Пользователи не найдены
          </p>
        )}

      {!error &&
        filteredUsers.length > 0 &&
        !(isFetching || isTabSwitching) && <UserTable users={filteredUsers} />}
    </div>
  );
};

export default Home;
