import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../services/auth-header";
import { ListResponse, PageArgs } from "./data-types";
import { ITeam } from "./team-query";

export interface IChannel {
  _id: string;
  isActive: boolean;
  name: string;
  members: Array<IMember>;
  team: Partial<ITeam>;
  createdAt: string;
  updatedAt: string;
}

interface IMember {
  _id: string;
  isAdmin: boolean;
  userId: string;
  email: string;
}

export const channelApi = createApi({
  reducerPath: "channelApi",
  baseQuery: baseQuery,
  tagTypes: ["Channel"],
  endpoints: (builder) => ({
    listChannel: builder.query<ListResponse<IChannel>, PageArgs>({
      query: ({ page, limit, search, status }) =>
        `channel?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.docs.map(({ _id }) => ({
                type: "Channel" as const,
                _id,
              })),
              "Channel",
            ]
          : ["Channel"],
    }),
    addChannel: builder.mutation<IChannel, Partial<IChannel>>({
      query: (body) => ({
        url: "/channel",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Channel"],
    }),
    changeStatus: builder.mutation<IChannel, Partial<IChannel>>({
      query: ({ _id, ...patch }) => ({
        url: `/channel/status/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "Channel", _id }],
    }),
  }),
});

export const {
  useListChannelQuery,
  useAddChannelMutation,
  useChangeStatusMutation,
} = channelApi;
