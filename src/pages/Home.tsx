import { useState, useEffect, useMemo } from "react";
import type { Committer, Mode, SortOption } from "@/types";
import { Helmet } from "react-helmet-async";
import {
  ErrorMessage,
  LoadingSpinner,
  UserTable,
  FilterBar,
  Header,
  type VerifiedUser,
} from "@/components/common";
import { useSearchParams } from "react-router-dom";
import { useGetTajikistanUsersQuery } from "@/api";

const PAGE_SIZE = 20;

const Home = () => {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) || "commits";
  const [mode, setMode] = useState<Mode>(initialMode);

  const initialSort =
    (searchParams.get("sort") as SortOption) || "commits-desc";
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("verifiedUsers");
    if (stored) {
      try {
        setVerifiedUsers(JSON.parse(stored));
      } catch {
        setVerifiedUsers([]);
      }
    }
  }, []);

  const handleUserVerified = (user: Committer, gistUrl = "") => {
    setVerifiedUsers((prev) => {
      if (prev.find((u) => u.username === user.username)) return prev;
      const updated: VerifiedUser[] = [
        ...prev,
        {
          username: user.username,
          gistUrl,
          verifiedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem("verifiedUsers", JSON.stringify(updated));
      return updated;
    });
  };

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [localData, setLocalData] = useState<Committer[]>([]);
  const search = searchParams.get("search") || "";

  const { data, error, isFetching, refetch } = useGetTajikistanUsersQuery(
    mode,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => setLocalData([]), [mode]);

  useEffect(() => {
    if (data?.users) setLocalData(data.users);
  }, [data]);

  const sortedAndFilteredUsers = useMemo(() => {
    if (!localData) return [];
    let users = [...localData];
    if (search.trim()) {
      users = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      );
    }
    switch (sortBy) {
      case "alphabetical-asc":
        users.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case "alphabetical-desc":
        users.sort((a, b) => b.username.localeCompare(a.username));
        break;
      case "commits-asc":
        users.sort((a, b) => a.commits - b.commits);
        break;
      case "commits-desc":
      default:
        users.sort((a, b) => b.commits - a.commits);
    }
    return users;
  }, [localData, search, sortBy]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode, search, sortBy]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        visibleCount < sortedAndFilteredUsers.length
      ) {
        setVisibleCount((v) => v + PAGE_SIZE);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [visibleCount, sortedAndFilteredUsers.length]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Helmet>
        <title>Most active GitHub users in Tajikistan</title>
      </Helmet>
      <Header
        verifiedUser={verifiedUsers[0] || null}
        onLogout={() => {
          localStorage.removeItem("verifiedUsers");
          setVerifiedUsers([]);
        }}
      />

      {data?.generatedAt && (
        <p className="text-start text-sm text-gray-500 dark:text-gray-400 mb-4">
          This list was generated at: {" "}
          <code className="font-bold">
            {data.generatedAt.replace(/\s\+0000\.?$/, "")}
          </code>
          .
        </p>
      )}

      <FilterBar
        mode={mode}
        setMode={setMode}
        refetch={refetch}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {(isFetching || localData.length === 0) && <LoadingSpinner />}
      {error && (
        <ErrorMessage
          title="Error loading data"
          message="Try refreshing the page."
          className="mt-10"
        />
      )}

      {!error && sortedAndFilteredUsers.length === 0 && !isFetching && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No users found
        </p>
      )}

      {!error && sortedAndFilteredUsers.length > 0 && !isFetching && (
        <>
          <UserTable
            users={sortedAndFilteredUsers.slice(0, visibleCount)}
            onUserVerified={handleUserVerified}
            verifiedUsers={verifiedUsers}
          />

          {visibleCount < sortedAndFilteredUsers.length && (
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
