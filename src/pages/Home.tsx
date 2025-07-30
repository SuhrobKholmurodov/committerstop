import { useState } from "react";
import {
  useGetTajikistanUsersQuery,
  type Mode,
} from "../features/api/committersApi";
import UserTable from "@/components/common/UserTable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Home = () => {
  const [mode, setMode] = useState<Mode>("commits");
  const { data, error, isLoading } = useGetTajikistanUsersQuery(mode);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Активные GitHub пользователи (Таджикистан)
      </h1>

      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(val) => val && setMode(val as Mode)}
        className="mb-6 inline-flex rounded-lg bg-gray-200 dark:bg-gray-800 p-2"
      >
        {["commits", "contributions", "all"].map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={value}
            className="cursor-pointer select-none rounded-md px-5 py-2
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

      {isLoading && <p className="text-center mt-10">Loading...</p>}
      {error && (
        <p className="text-center text-red-500">Ошибка загрузки данных</p>
      )}
      {data && <UserTable users={data} />}
    </div>
  );
};

export default Home;
