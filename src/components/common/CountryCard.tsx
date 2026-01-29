import { Link } from "react-router-dom";
import { useGetCountryUsersQuery } from "@/api";
import { useGetFlagsQuery } from "@/api/flagsApi";
import type { Committer } from "@/types";

export const CountryCard = ({
  country,
  onUserClick,
}: {
  country: { slug: string; name: string };
  onUserClick: (user: Committer) => void;
}) => {
  const { data } = useGetCountryUsersQuery({
    country: country.slug,
    mode: "all",
  });

  const { data: flags } = useGetFlagsQuery();
  const flagUrl = flags?.find(
    (f) => f.name.toLowerCase() === country.name.toLowerCase(),
  )?.flagUrl;

  const topUsers = data?.users?.slice(0, 3) || [];

  return (
    <div className="border rounded-xl p-4 bg-white dark:bg-gray-900">
      <Link to={`/${country.slug}`}>
        <div className="flex items-center gap-3 mb-3">
          {flagUrl && (
            <img src={flagUrl} className="w-8 h-6" alt={country.name} />
          )}
          <h3 className="font-semibold hover:underline">{country.name}</h3>
        </div>
      </Link>

      <ul className="space-y-2">
        {topUsers.map((user) => (
          <li
            key={user.username}
            onClick={() => onUserClick(user)}
            className="flex items-center gap-2 cursor-pointer hover:underline"
          >
            <img src={user.avatar} className="w-6 h-6 rounded-full" />
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};
