import { useState, useEffect, useMemo } from "react";
import type { Committer, Mode, SortOption } from "@/types";
import { Helmet } from "react-helmet-async";
import {
  ErrorMessage,
  LoadingSpinner,
  UserTable,
  FilterBar,
  Header,
} from "@/components/common";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useGetCountryUsersQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ArrowLeft, Users } from "lucide-react";

const PAGE_SIZE = 20;

const Country = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();

  const initialMode = (searchParams.get("mode") as Mode) || "commits";
  const [mode, setMode] = useState<Mode>(initialMode);

  const initialSort =
    (searchParams.get("sort") as SortOption) || "commits-desc";
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [localData, setLocalData] = useState<Committer[]>([]);

  const search = searchParams.get("search") || "";
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
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>Most active GitHub users in {formattedCountryName}</title>
      </Helmet>

      <Header countryName={formattedCountryName} />

      <div className="pt-24 px-4 md:px-6">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
              text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
              hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Countries</span>
          </Link>
        </div>

        {data?.generatedAt && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated:{" "}
              <code className="font-mono text-gray-800 dark:text-gray-300 px-1">
                {data.generatedAt.replace(/\s\+0000\.?$/, "")}
              </code>
            </p>
          </div>
        )}

        <div className="sticky top-[70px] z-20 mb-6">
          <FilterBar
            mode={mode}
            setMode={setMode}
            refetch={refetch}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {isFetching && localData.length === 0 && (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <ErrorMessage
            title="Error loading data"
            message="Try refreshing the page or check your connection."
            className="mt-10"
          />
        )}

        {!error &&
          sortedAndFilteredUsers.length === 0 &&
          search.trim() !== "" &&
          !isFetching && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700">
                <Users className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No users found matching "{search}"
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                Try a different username or clear the search
              </p>
            </div>
          )}

        {!error &&
          sortedAndFilteredUsers.length === 0 &&
          search.trim() === "" &&
          !isFetching && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700">
                <Users className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No users in {formattedCountryName} yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                Set your location to '{formattedCountryName}' in your GitHub
                profile
              </p>
            </div>
          )}

        {!error && sortedAndFilteredUsers.length > 0 && (
          <>
            <UserTable users={visibleUsers} />

            {hasMoreUsers && isFetching && (
              <div className="flex flex-col items-center my-8">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Loading more users...
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t dark:border-gray-800">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
                  text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                  hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to all countries</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Country;
