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
import { useParams, useSearchParams } from "react-router-dom";
import { useGetCountryUsersQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const PAGE_SIZE = 20;

const Country = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();

  const initialMode = (searchParams.get("mode") as Mode) || "commits";
  const [mode, setMode] = useState<Mode>(initialMode);

  const initialSort =
    (searchParams.get("sort") as SortOption) || "commits-desc";
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [localData, setLocalData] = useState<Committer[]>([]);

  const search = searchParams.get("search") || "";

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

  const { data, error, isFetching, refetch } = useGetCountryUsersQuery(
    slug ? { country: slug, mode } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  useEffect(() => {
    setLocalData([]);
  }, [mode]);

  useEffect(() => {
    if (data?.users) setLocalData(data.users);
  }, [data]);

  const sortedAndFilteredUsers = useMemo(() => {
    let users = [...localData];

    if (search.trim()) {
      users = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase()),
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

  const visibleUsers = useMemo(
    () => sortedAndFilteredUsers.slice(0, visibleCount),
    [sortedAndFilteredUsers, visibleCount],
  );

  const hasMoreUsers = visibleCount < sortedAndFilteredUsers.length;

  const handleLoadMore = () => {
    if (!isFetching && hasMoreUsers) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  };

  useInfiniteScroll({
    isLoading: isFetching,
    hasMore: hasMoreUsers,
    onLoadMore: handleLoadMore,
    threshold: 200,
  });

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [mode, search, sortBy]);

  const handleLogout = () => {
    localStorage.removeItem("verifiedUsers");
    setVerifiedUsers([]);
  };

  if (!slug) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <ErrorMessage
          title="Invalid country"
          message="Country slug is missing in URL."
        />
      </div>
    );
  }

  const formattedCountryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Helmet>
        <title>Most active GitHub users in {formattedCountryName}</title>
      </Helmet>

      <Header verifiedUser={verifiedUsers[0] || null} onLogout={handleLogout} />

      {data?.generatedAt && (
        <p className="text-start text-sm text-gray-500 dark:text-gray-400 mb-4">
          This list was generated at{" "}
          <code className="font-bold">
            {data.generatedAt.replace(/\s\+0000\.?$/, "")}
          </code>
        </p>
      )}

      <FilterBar
        mode={mode}
        setMode={setMode}
        refetch={refetch}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {isFetching && localData.length === 0 && <LoadingSpinner />}

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

      {!error && sortedAndFilteredUsers.length > 0 && (
        <>
          <UserTable
            users={visibleUsers}
            onUserVerified={handleUserVerified}
            verifiedUsers={verifiedUsers}
          />

          {hasMoreUsers && isFetching && (
            <div className="flex flex-col items-center my-8">
              <LoadingSpinner />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Loading more users...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Country;
