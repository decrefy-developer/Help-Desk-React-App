import { createApi } from "@reduxjs/toolkit/query/react";
import { ITicket, ListResponse, TicketArgs } from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

export const fillingApi = createApi({
    reducerPath: "fillingApi",
    baseQuery: baseQuery,
    tagTypes: ['Filling'],
    endpoints: (builder) => ({
        listFillingTicket: builder.query<ListResponse<ITicket>, TicketArgs>({
            query: ({ page, limit, search = "", channelId, departmentId, state, statusTicket, isFiled }) =>
                `filling?page=${page}&limit=${limit}&search=${search}&channelId=${channelId}&departmentId=${departmentId}&state=${state}&status=${statusTicket}&isFiled=${isFiled}`,
            providesTags: (result, error, arg) =>
                result
                    ? [
                        ...result.docs.map(({ _id }) => ({
                            type: "Filling" as const,
                            _id,
                        })),
                        "Filling",
                    ]
                    : ["Filling"],
        }),
        fileTicket: builder.mutation<any, { ticketId: Array<string> }>({
            query: (body) => ({
                url: "/filling",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Filling"],
        })
    })
})

export const {
    useListFillingTicketQuery,
    useFileTicketMutation
} = fillingApi