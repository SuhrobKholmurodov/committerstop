import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface VerifyGistResponse {
  verified: boolean;
  gistUrl?: string;
}

export const verifyGistApi = createApi({
  reducerPath: "verifyGistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.github.com/",
  }),
  endpoints: (builder) => ({
    verifyUserGist: builder.query<
      VerifyGistResponse,
      { username: string; token: string }
    >({
      query: ({ username }) => `users/${username}/gists`,
      transformResponse: (response: any, meta, { username, token }) => {
        const found = response.find(
          (gist: any) => gist.description && gist.description.includes(token)
        );

        if (found) {
          const verifiedUsers = JSON.parse(
            localStorage.getItem("verifiedUsers") || "[]"
          );
          const exists = verifiedUsers.some(
            (u: any) => u.username === username
          );

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
