import { configureStore } from "@reduxjs/toolkit";
import { committersApi } from "../api/committersApi";
import { githubApi } from "../api/githubApi";

export const store = configureStore({
  reducer: {
    [committersApi.reducerPath]: committersApi.reducer,
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(committersApi.middleware)
      .concat(githubApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
