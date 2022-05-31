import { createApi } from "@reduxjs/toolkit/query/react";
import { IFormInputTransfer, ITransferTicket } from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

export const transferApi = createApi({
    reducerPath: "transferApi",
    baseQuery: baseQuery,
    tagTypes: ['Transfer'],
    endpoints: (builder) => ({
        listTransferTicket: builder.query<Array<ITransferTicket>, { team: string, isApproved?: boolean | undefined }>({
            query: ({ team, isApproved }) => `transfer?team=${team}&isApproved=${isApproved}`,
            providesTags: (result, error, arg) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({
                            type: "Transfer" as const,
                            _id,
                        })),
                        "Transfer",
                    ]
                    : ["Transfer"],
        }),
        updateTransferTicket: builder.mutation<ITransferTicket, { _id: string, mode: string, channelId: string, userId: string }>({
            query: ({ _id, ...patch }) => ({
                url: `/transfer/${_id}`,
                method: "PUT",
                body: patch
            }),
            invalidatesTags: (result, error, { _id }) => [{ type: "Transfer", _id }],

        }),
        createTransferRequest: builder.mutation<ITransferTicket, IFormInputTransfer>({
            query: (body) => ({
                url: "/ticket/transfer",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Transfer"],
        })
    })

})

export const {
    useListTransferTicketQuery,
    useUpdateTransferTicketMutation,
    useCreateTransferRequestMutation
} = transferApi