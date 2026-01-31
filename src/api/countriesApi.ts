import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./config";

export interface Country {
  slug: string;
  name: string;
  flagUrl: string;
}

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    responseHandler: (r) => r.text(),
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => "countries",
      transformResponse: (html: string) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const links = doc.querySelectorAll("ul.country-list li a");

        return [...links].map((a) => ({
          slug: a.getAttribute("href")?.replace("/", "") || "unknown",
          name: a.textContent?.trim() || "Unknown",
          flagUrl: "",
        }));
      },
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
