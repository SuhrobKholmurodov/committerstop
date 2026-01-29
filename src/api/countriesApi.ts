import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Country {
  slug: string;
  name: string;
  flagUrl: string;
}

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.allorigins.win/raw?url=",
    responseHandler: (r) => r.text(),
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => "https://committers.top",
      transformResponse: (html: string) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const links = doc.querySelectorAll("ul.country-list li a");
        return [...links].map((a) => ({
          slug: a.getAttribute("href")?.trim() || "unknown",
          name: a.textContent?.trim() || "Unknown",
          flagUrl: "",
        }));
      },
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
