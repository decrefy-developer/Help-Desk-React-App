import { createApi } from "@reduxjs/toolkit/query/react";
import { ITeam, ListResponse, PageArgs } from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQuery,
  tagTypes: ["Team"],
  endpoints: (builder) => ({
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
    getTeam: builder.query<ITeam, string>({
      query: (_id) => `team/${_id}`,
      providesTags: (result, error, _id) => [{ type: "Team", _id }],
    }),
    addTeam: builder.mutation<ITeam, { name: string }>({
      query: (body) => ({
        url: "/team",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team"],
    }),
    changeStatus: builder.mutation<ITeam, Partial<ITeam>>({
      query: ({ _id, ...patch }) => ({
        url: `/team/status/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "Team", _id }],
    }),
  }),
});

export const { useAddTeamMutation, useListTeamQuery, useChangeStatusMutation, useGetTeamQuery } =
  teamApi;
