import userSlice from "../features/user-slice";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth-query";
import { memberApi } from "../features/member-query";
import { teamApi } from "../features/team-query";
import { channelApi } from "../features/channel-query";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [channelApi.reducerPath]: channelApi.reducer,
    userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      memberApi.middleware,
      teamApi.middleware,
      channelApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
