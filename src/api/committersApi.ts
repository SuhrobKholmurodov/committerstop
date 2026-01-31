import type { Committer, Mode } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./config";

export const committersApi = createApi({
  reducerPath: "committersApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getCountryUsers: builder.query<
      { users: Committer[]; generatedAt: string },
      { country: string; mode: Mode }
    >({
      query: ({ country, mode }) => `committers/${country}/${mode}`,
    }),
  }),
});

export const { useGetCountryUsersQuery } = committersApi;
