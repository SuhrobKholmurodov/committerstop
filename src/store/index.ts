import { configureStore } from "@reduxjs/toolkit";
import { committersApi } from "../features/api/committersApi";

export const store = configureStore({
  reducer: {
    [committersApi.reducerPath]: committersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(committersApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
