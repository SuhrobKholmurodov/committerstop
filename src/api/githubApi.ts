import type { GitHubUser } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const token = import.meta.env.GITHUB_TOKEN;

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.github.com/",
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/vnd.github.v3+json");
      return headers;
    },
  }),
  keepUnusedDataFor: 86400,
  endpoints: (builder) => ({
    getGitHubUserByUsername: builder.query<GitHubUser, string>({
      query: (username) => `users/${username}`,
      keepUnusedDataFor: 86400,
    }),
  }),
});

export const { useGetGitHubUserByUsernameQuery } = githubApi;
