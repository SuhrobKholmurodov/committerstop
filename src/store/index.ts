import { configureStore } from "@reduxjs/toolkit";
import { verifyGistApi } from "@/api/verifyGistApi";
import { committersApi, githubApi } from "@/api";
import { countriesApi } from "@/api/countriesApi";
import { flagsApi } from "@/api/flagsApi";

export const store = configureStore({
  reducer: {
    [committersApi.reducerPath]: committersApi.reducer,
    [githubApi.reducerPath]: githubApi.reducer,
    [verifyGistApi.reducerPath]: verifyGistApi.reducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [flagsApi.reducerPath]: flagsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(committersApi.middleware)
      .concat(githubApi.middleware)
      .concat(verifyGistApi.middleware)
      .concat(countriesApi.middleware)
      .concat(flagsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
