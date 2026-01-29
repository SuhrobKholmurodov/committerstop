import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useGetCountriesQuery } from "@/api/countriesApi";
import type { Committer } from "@/types";
import { UserDialog, type VerifiedUser } from "@/components/common";
import { Header } from "../components/common/Header";
import { CountryCard } from "@/components/common/CountryCard";

const Home = () => {
  const { data: countries, isLoading } = useGetCountriesQuery();
  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);

  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([]);

  const handleUserVerified = (user: Committer, gistUrl = "") => {
    setVerifiedUsers((prev) => {
      if (prev.find((u) => u.username === user.username)) return prev;
      const updated = [
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

  const handleLogout = () => {
    localStorage.removeItem("verifiedUsers");
    setVerifiedUsers([]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <Helmet>
        <title>GitHub Contributors by Country | Global Rankings</title>
        <meta
          name="description"
          content="Discover top GitHub contributors from countries worldwide. Explore rankings, stats, and connect with developers."
        />
      </Helmet>

      <Header verifiedUser={verifiedUsers[0] || null} onLogout={handleLogout} />

      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Discover {countries?.length} countries with active GitHub communities.
          Click any country to explore top contributors.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 bg-white dark:bg-gray-900 animate-pulse"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6">
            {countries?.map((country) => (
              <CountryCard
                key={country.slug}
                country={country}
                onUserClick={setSelectedUser}
              />
            ))}
          </div>

          <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
            <p>
              Showing {countries?.length || 0} countries with active GitHub
              communities
            </p>
          </div>
        </>
      )}

      {selectedUser && (
        <UserDialog
          user={selectedUser}
          open={true}
          onOpenChange={() => setSelectedUser(null)}
          onVerified={handleUserVerified}
        />
      )}
    </div>
  );
};

export default Home;
