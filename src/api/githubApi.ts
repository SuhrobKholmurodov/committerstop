import type { GitHubUser } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.github.com/" }),
  endpoints: (builder) => ({
    getGitHubUserByUsername: builder.query<GitHubUser, string>({
      query: (username) => `users/${username}`,
    }),
  }),
});

export const { useGetGitHubUserByUsernameQuery } = githubApi;
