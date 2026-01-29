import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface FlagData {
  name: string;
  flagUrl: string;
}

interface RestCountryResponse {
  name: { common: string };
  flags?: { png?: string; svg?: string };
}

export const flagsApi = createApi({
  reducerPath: "flagsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://restcountries.com/v3.1/" }),
  endpoints: (builder) => ({
    getFlags: builder.query<FlagData[], void>({
      query: () => "all?fields=name,flags",
      transformResponse: (data: RestCountryResponse[]) => {
        return data.map((c) => ({
          name: c.name.common,
          flagUrl: c.flags?.png || "",
        }));
      },
    }),
  }),
});

export const { useGetFlagsQuery } = flagsApi;
