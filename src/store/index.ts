import { configureStore } from "@reduxjs/toolkit";
import { verifyGistApi } from "@/api/verifyGistApi";
import { committersApi, githubApi } from "@/api";

export const store = configureStore({
  reducer: {
    [committersApi.reducerPath]: committersApi.reducer,
    [githubApi.reducerPath]: githubApi.reducer,
    [verifyGistApi.reducerPath]: verifyGistApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(committersApi.middleware)
      .concat(githubApi.middleware)
      .concat(verifyGistApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
