import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../services/auth-header";
import { ListResponse, PageArgs } from "./data-types";

export interface ITeam {
  _id: string;
  isActive: boolean;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQuery,
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    addTeam: builder.mutation<ITeam, { name: string }>({
      query: (body) => ({
        url: "/team",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team"],
    }),
    listTeam: builder.query<ListResponse<ITeam>, PageArgs>({
      query: ({ page = 1, limit = 10, search = "", status }) =>
        `team?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.docs.map(({ _id }) => ({
                type: "Team" as const,
                _id,
              })),
              "Team",
            ]
          : ["Team"],
    }),
  }),
});

export const { useAddTeamMutation, useListTeamQuery } = teamApi;
