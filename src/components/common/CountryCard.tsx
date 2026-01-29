import { Link } from "react-router-dom";
import { useGetCountryUsersQuery } from "@/api";
import { useGetFlagsQuery } from "@/api/flagsApi";
import type { Committer } from "@/types";
import { Users, GitCommit, Medal, ChevronRight } from "lucide-react";
import Tippy from "@tippyjs/react";

export const CountryCard = ({
  country,
  onUserClick,
}: {
  country: { slug: string; name: string };
  onUserClick: (user: Committer) => void;
}) => {
  const { data, isLoading } = useGetCountryUsersQuery({
    country: country.slug,
    mode: "all",
  });

  const { data: flags } = useGetFlagsQuery();
  const flagUrl = flags?.find(
    (f) => f.name.toLowerCase() === country.name.toLowerCase(),
  )?.flagUrl;

  const topUsers = data?.users?.slice(0, 3) || [];
  const totalUsers = data?.users?.length || 0;
  const totalCommits =
    data?.users?.reduce((sum, user) => sum + user.commits, 0) || 0;

  return (
    <Link to={`/${country.slug}`} className="block group">
      <div className="border rounded-2xl p-5 bg-white dark:bg-gray-900 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isLoading ? (
                <div className="w-10 h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : flagUrl ? (
                <img
                  src={flagUrl}
                  className="w-10 h-7 rounded border shadow-sm object-cover"
                  alt={country.name}
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-7 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded border flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">🏳️</span>
                </div>
              )}
              {!isLoading && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              )}
            </div>
            <div>
              {isLoading ? (
                <>
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {country.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {country.slug}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-full">
            {isLoading ? (
              <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : totalUsers > 0 ? (
              <Tippy
                content={
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    Avg commits per dev
                  </span>
                }
                placement="top"
                className="!bg-blue-50 dark:!bg-blue-900 !border !border-blue-200 dark:!border-blue-700 !text-blue-800 dark:!text-blue-200"
                arrow={false}
              >
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <GitCommit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    {Math.round(totalCommits / totalUsers).toLocaleString()}
                  </span>
                </div>
              </Tippy>
            ) : (
              <Tippy
                content="No data available"
                className="!bg-gray-100 dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !text-gray-800 dark:!text-gray-200"
                arrow={false}
              >
                <span className="text-xs text-gray-500 cursor-help">—</span>
              </Tippy>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            {isLoading ? (
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {totalUsers} devs
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <GitCommit className="w-4 h-4 text-gray-400" />
            {isLoading ? (
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {totalCommits.toLocaleString()} commits
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700"></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Top Contributors
              </span>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700"></div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {topUsers.map((user, index) => (
                <div
                  key={user.username}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onUserClick(user);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                        alt={user.username}
                        loading="lazy"
                      />
                      <div
                        className={`absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] rounded-full border-2 border-white dark:border-gray-800 ${
                          index === 0
                            ? "bg-yellow-400"
                            : index === 1
                              ? "bg-gray-300"
                              : "bg-orange-500"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <GitCommit className="w-3 h-3" />
                        {user.commits.toLocaleString()} commits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {index < 3 ? (
                      <Medal
                        className={`w-4 h-4 ${
                          index === 0
                            ? "text-yellow-500 fill-yellow-500/20"
                            : index === 1
                              ? "text-gray-400 fill-gray-400/20"
                              : "text-orange-500 fill-orange-500/20"
                        }`}
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center">
              <div className="h-6 w-[180px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          totalUsers > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                <span>View all contributors</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )
        )}
      </div>
    </Link>
  );
};
