import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IFormInputTicket,
  ITicket,
  ListResponse,
  TicketArgs,
} from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: baseQuery,
  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    addTicket: builder.mutation<any, IFormInputTicket>({
      query: (body) => ({
        url: "/ticket",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket"],
    }),
    listTickets: builder.query<ListResponse<ITicket>, TicketArgs>({
      query: ({ page, limit, search = "", channelId, state, statusTicket }) =>
        `ticket?page=${page}&limit=${limit}&search=${search}&channelId=${channelId}&state=${state}&status=${statusTicket}`,
      providesTags: (result, error, arg) =>
        result
          ? [
            ...result.docs.map(({ _id }) => ({
              type: "Ticket" as const,
              _id,
            })),
            "Ticket",
          ]
          : ["Ticket"],
    }),
    getTicket: builder.query<ITicket, string>({
      query: (_id) => `ticket/${_id}`,
      providesTags: (result, error, _id) => [{ type: "Ticket", _id }],
    }),
    doneTicket: builder.mutation<
      any,
      {
        _id: string;
        mode: string;
        solution: string;
        categoryId: string;
        SubCategoryId: string;
      }
    >({
      query: ({ _id, ...patch }) => ({
        url: `/ticket/done/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "Ticket", _id }],
    }),
    closeTicket: builder.mutation<any, { _id: string; mode: string }>({
      query: ({ _id, ...patch }) => ({
        url: `/ticket/closing/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "Ticket", _id }],
    }),
    cancelTicket: builder.mutation<any, { _id: string; mode: string }>({
      query: ({ _id, ...patch }) => ({
        url: `/ticket/cancel/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "Ticket", _id }],
    }),
    ticketsNotSeen: builder.query<
      Array<{ _id: string; count: number }>,
      string
    >({
      query: (_id) => `ticket/seen/${_id}`,
      providesTags: ["Ticket"],
    }),
    seenTheTicket: builder.mutation<IFormInputTicket, string>({
      query: (_id) => ({
        url: `ticket/seen/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, _id) => [{ type: "Ticket", _id }],
    }),
    updateTargetDate: builder.mutation<
      IFormInputTicket,
      { _id: string; targetDate: string }
    >({
      query: ({ _id, ...patch }) => ({
        url: `ticket/target-date/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, _id) => [{ type: "Ticket", _id }],
    }),
    reports: builder.query<Array<ITicket>, TicketArgs>({
      query: ({ openDate, closedDate, team, channelId, statusTicket }) =>
        `reports?status=${statusTicket}&team=${team}&channel=${channelId}&openDate=${openDate}&closedDate=${closedDate}`,
    }),
  }),
});

export const {
  useAddTicketMutation,
  useListTicketsQuery,
  useDoneTicketMutation,
  useCloseTicketMutation,
  useCancelTicketMutation,
  useTicketsNotSeenQuery,
  useSeenTheTicketMutation,
  useGetTicketQuery,
  useUpdateTargetDateMutation,
  useReportsQuery
} = ticketApi;
