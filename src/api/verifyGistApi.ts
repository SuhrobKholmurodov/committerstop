import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface VerifyGistResponse {
  verified: boolean;
  gistUrl?: string;
}

interface GitHubGist {
  description: string | null;
  html_url: string;
}

export const verifyGistApi = createApi({
  reducerPath: "verifyGistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.github.com/",
    prepareHeaders: (headers) => {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    verifyUserGist: builder.query<
      VerifyGistResponse,
      { username: string; token?: string }
    >({
      query: ({ username }) => `users/${username}/gists`,
      transformResponse: (response: GitHubGist[], _, arg) => {
        console.log(
          "all gist:",
          response.map((g) => g.description)
        );
        const { username, token } = arg;

        const found = response.find(
          (gist) => gist.description && gist.description.includes(token!)
        );

        console.log("founded gist:", found);
        if (found) {
          const verifiedUsers: {
            username: string;
            gistUrl: string;
            rank: string;
          }[] = JSON.parse(localStorage.getItem("verifiedUsers") || "[]");

          const exists = verifiedUsers.some((u) => u.username === username);

          if (!exists) {
            verifiedUsers.push({
              username,
              gistUrl: found.html_url,
              rank: "Contributor",
            });
            localStorage.setItem(
              "verifiedUsers",
              JSON.stringify(verifiedUsers)
            );
          }

          return { verified: true, gistUrl: found.html_url };
        }

        return { verified: false };
      },
    }),
  }),
});

export const { useVerifyUserGistQuery } = verifyGistApi;
