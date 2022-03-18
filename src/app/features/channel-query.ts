import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IChannel,
  IFormInputChannelMember,
  ListResponse,
  PageArgs,
} from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

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
    getChannel: builder.query<IChannel, string>({
      query: (_id) => `channel/${_id}`,
      // providesTags: (result, error, _id) => [{ type: "Channel", _id }],
    }),
    ManageMembertoChannel: builder.mutation<IChannel, IFormInputChannelMember>({
      query: ({ _id, ...patch }) => ({
        url: `/channel/${_id}`,
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
  useGetChannelQuery,
  useManageMembertoChannelMutation,
} = channelApi;
