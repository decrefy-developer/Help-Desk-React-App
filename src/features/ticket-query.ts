import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IFormInputTicket,
  ITicket,
  ListResponse,
  PageArgs,
} from "../models/interface";
import { baseQuery } from "../services/auth-header";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: baseQuery,
  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    addTicket: builder.mutation<{ ticketNumber: string }, IFormInputTicket>({
      query: (body) => ({
        url: "/ticket",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket"],
    }),
    listTickets: builder.query<ListResponse<ITicket>, PageArgs>({
      query: ({ page = 1, limit = 10, search = "", status }) =>
        `ticket?page=${page}&limit=${limit}&search=${search}&status=${status}`,
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
  }),
});

export const { useAddTicketMutation, useListTicketsQuery } = ticketApi;
