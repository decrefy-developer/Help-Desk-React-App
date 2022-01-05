import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { serverUrl } from "../services/Config";

interface IAuth {
  accessToken: string;
  refreshToken: string;
}

interface ICred {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: serverUrl }),
  tagTypes: ["Auth", "UNAUTHORIZED", "UNKNOWN_ERROR"],
  endpoints: (builder) => ({
    login: builder.mutation<IAuth, ICred>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "LIST" }],
    }),
  }),
});

export const { useLoginMutation } = authApi;
