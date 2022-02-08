import { createApi } from "@reduxjs/toolkit/query/react";
import { IFormInputTicket } from "../models/interface";
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
  }),
});

export const { useAddTicketMutation } = ticketApi;
