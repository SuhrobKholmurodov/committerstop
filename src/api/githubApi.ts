import type { GitHubUser } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://committerstop-backend.vercel.app"
    : "http://localhost:3000");

console.log("API_BASE_URL:", API_BASE_URL);

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getGitHubUserByUsername: builder.query<GitHubUser, string>({
      query: (username) => `github-user/${username}`,
    }),
  }),
});

export const { useGetGitHubUserByUsernameQuery } = githubApi;
