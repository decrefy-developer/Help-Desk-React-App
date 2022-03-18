import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth-query";
import { memberApi } from "./features/member-query";
import { teamApi } from "./features/team-query";
import { channelApi } from "./features/channel-query";
import { customerApi } from "./features/customer-query";
import { categoryConcernApi } from "./features/category-query";
import { ticketApi } from "./features/ticket-query";
import { departmentApi } from "./features/department-query";
import { requestApi } from "./features/request-query";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [channelApi.reducerPath]: channelApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [categoryConcernApi.reducerPath]: categoryConcernApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [requestApi.reducerPath]: requestApi.reducer,
    // userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      memberApi.middleware,
      teamApi.middleware,
      channelApi.middleware,
      customerApi.middleware,
      categoryConcernApi.middleware,
      ticketApi.middleware,
      departmentApi.middleware,
      requestApi.middleware
    ),
});

// export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
