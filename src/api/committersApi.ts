import type { Committer, Mode } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const modeToUrl = (country: string): Record<Mode, string> => ({
  commits: `https://committers.top/${country}`,
  contributions: `https://committers.top/${country}_public`,
  all: `https://committers.top/${country}_private`,
});

export const committersApi = createApi({
  reducerPath: "committersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.allorigins.win/raw?url=",
    responseHandler: (response) => response.text(),
  }),
  endpoints: (builder) => ({
    getCountryUsers: builder.query<
      { users: Committer[]; generatedAt: string },
      { country: string; mode: Mode }
    >({
      query: ({ country, mode }) => modeToUrl(country)[mode],
      transformResponse: (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const codeElem = doc.querySelector("p code");
        const generatedAt = codeElem?.textContent || "";
        const rows = doc.querySelectorAll("table.users-list tbody tr");

        const users: Committer[] = [];
        rows.forEach((row) => {
          const rank = parseInt(
            row
              .querySelector("td:nth-child(1)")
              ?.textContent?.replace(".", "") || "0",
            10,
          );
          const userCell = row.querySelector("td:nth-child(2)");
          const username =
            userCell?.querySelector("a")?.textContent?.trim() || "";
          const profile =
            userCell?.querySelector("a")?.getAttribute("href") || "";
          const commits = parseInt(
            row.querySelector("td:nth-child(3)")?.textContent || "0",
            10,
          );
          const avatar =
            row
              .querySelector("td:nth-child(4) img")
              ?.getAttribute("data-src") || "";

          let realname = "";
          if (userCell) {
            const br = userCell.querySelector("br");
            if (br && br.nextSibling) {
              const textAfterBr = br.nextSibling.textContent?.trim() || "";
              realname = textAfterBr.replace(/^\(|\)$/g, "");
            }
          }
          if (username) {
            users.push({ rank, username, profile, commits, avatar, realname });
          }
        });
        return { users, generatedAt };
      },
    }),
  }),
});

export const { useGetCountryUsersQuery } = committersApi;
