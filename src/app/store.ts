import userSlice from "../features/user-slice";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth-query";
import { memberApi } from "../features/member-query";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, memberApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
