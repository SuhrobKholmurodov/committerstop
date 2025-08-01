import { useState, useEffect, useMemo } from "react";
import { useGetTajikistanUsersQuery } from "../api/committersApi";
import type { Committer, Mode } from "@/types";
import { Helmet } from "react-helmet-async";
import { ErrorMessage, LoadingSpinner, UserTable, FilterBar, Header } from "@/components/common";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 20;

const Home = () => {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) || "commits";
  const [mode, setMode] = useState<Mode>(initialMode);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [localData, setLocalData] = useState<Committer[]>([]);
  const search = searchParams.get("search") || "";

  const { data, error, isFetching } = useGetTajikistanUsersQuery(mode, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    setLocalData([]);
  }, [mode]);

  useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  const filteredUsers = useMemo(() => {
    if (!localData) return [];
    if (!search.trim()) return localData;
    return localData.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [localData, search]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [mode, search]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        visibleCount < filteredUsers.length
      ) {
        setVisibleCount((v) => v + PAGE_SIZE);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [visibleCount, filteredUsers.length]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Helmet>
        <title>Most active GitHub users in Tajikistan</title>
      </Helmet>
      <Header />
      <FilterBar mode={mode} setMode={setMode} />

      {(isFetching || localData.length === 0) && <LoadingSpinner />}

      {error && (
        <ErrorMessage
          title="Error loading data"
          message="Try refreshing the page."
          className="mt-10"
        />
      )}

      {!error && filteredUsers.length === 0 && !isFetching && (
        <p className="text-center text-gray-600 dark:text-gray-400">No users found</p>
      )}

      {!error && filteredUsers.length > 0 && !isFetching && (
        <>
          <UserTable users={filteredUsers.slice(0, visibleCount)} />
          {visibleCount < filteredUsers.length && (
            <div className="flex justify-center my-4">
              <LoadingSpinner />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;