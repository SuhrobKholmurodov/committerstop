import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GitHubUser } from "@/types";
import { API_BASE_URL } from "./config";

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getGitHubUserByUsername: builder.query<GitHubUser, string>({
      query: (username) => `github-user/${username}`,
    }),
  }),
});
export const { useGetGitHubUserByUsernameQuery } = githubApi;
