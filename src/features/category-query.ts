import { createApi } from "@reduxjs/toolkit/query/react";
import { ICategoryConcern, ListResponse, PageArgs } from "../models/interface";
import { baseQuery } from "../services/auth-header";

export const categoryConcernApi = createApi({
  reducerPath: "categoryConcerApi",
  baseQuery: baseQuery,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    listCategoryConcern: builder.query<
      ListResponse<ICategoryConcern>,
      PageArgs
    >({
      query: ({ page = 1, limit = 10, search = "", status }) =>
        `category?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.docs.map(({ _id }) => ({
                type: "Category" as const,
                _id,
              })),
              "Category",
            ]
          : ["Category"],
    }),
  }),
});

export const { useListCategoryConcernQuery } = categoryConcernApi;
