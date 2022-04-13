import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ICategoryConcern,
  ISubCategory,
  ListResponse,
  PageArgs,
} from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

export const categoryConcernApi = createApi({
  reducerPath: "categoryConcerApi",
  baseQuery: baseQuery,
  tagTypes: ["Category", "SubCategory"],
  endpoints: (builder) => ({
    addCategory: builder.mutation<ICategoryConcern, { name: string }>({
      query: (body) => ({
        url: "/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
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
    changeStatus: builder.mutation<
      ICategoryConcern,
      Pick<ICategoryConcern, "isActive" | "_id">
    >({
      query: ({ _id, ...patch }) => ({
        url: `/category/status/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "Category", _id }],
    }),
    listSubCategory: builder.query<ListResponse<ISubCategory>, PageArgs>({
      query: ({ page = 1, limit = 10, search = "", status, categoryId }) =>
        `sub?page=${page}&limit=${limit}&search=${search}&status=${status}&categoryId=${categoryId}`,
      providesTags: (result, error, arg) =>
        result
          ? [
            ...result.docs.map(({ _id }) => ({
              type: "SubCategory" as const,
              _id,
            })),
            "SubCategory",
          ]
          : ["SubCategory"],
    }),
    addSubCategory: builder.mutation<ISubCategory, { categoryId: string, name: string }>({
      query: (body) => ({
        url: "/sub",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    changeSubUnitStatus: builder.mutation<
      ISubCategory,
      Pick<ISubCategory, "isActive" | "_id">
    >({
      query: ({ _id, ...patch }) => ({
        url: `/sub/status/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "SubCategory", _id },
      ],
    }),
  }),
});

export const {
  useListCategoryConcernQuery,
  useChangeStatusMutation,
  useListSubCategoryQuery,
  useAddCategoryMutation,
  useAddSubCategoryMutation,
  useChangeSubUnitStatusMutation
} = categoryConcernApi;
