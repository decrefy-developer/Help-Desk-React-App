import { createApi } from "@reduxjs/toolkit/query/react";
import { ICustomer, ListResponse, PageArgs } from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQuery,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    listCustomer: builder.query<ListResponse<ICustomer>, PageArgs>({
      query: ({ page = 1, limit = 10, search = "", status }) =>
        `customer?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      providesTags: (result, error, arg) =>
        result
          ? [
            ...result.docs.map(({ _id }) => ({
              type: "Customer" as const,
              _id,
            })),
            "Customer",
          ]
          : ["Customer"],
    }),
  }),
});

export const { useListCustomerQuery } = customerApi;
