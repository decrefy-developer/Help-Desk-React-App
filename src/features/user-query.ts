import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../services/auth-header";
import { ListResponse, PageArgs } from "./data-types";

interface IUser {
  _id: string;
  isActive: boolean;
  priviledge: Array<string>;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    listUser: builder.query<ListResponse<IUser>, PageArgs>({
      query: ({ page = 1, limit = 10 }) => `user?page=${page}&limit=${limit}`,
    }),
  }),
});

export const { useListUserQuery } = userApi;
