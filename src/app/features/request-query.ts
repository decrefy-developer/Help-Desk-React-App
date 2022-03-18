import { createApi } from "@reduxjs/toolkit/query/react";
import { IFormInputRequest, IRequest, ListResponse, PageArgs } from "../../models/interface";
import { baseQuery } from "../../services/auth-header";

export const requestApi = createApi({
    reducerPath: "requestApi",
    baseQuery: baseQuery,
    tagTypes: ["Request"],
    endpoints: (builder) => ({
        addRequest: builder.mutation<IRequest, IFormInputRequest>({
            query: (body) => ({
                url: "/request",
                method: "POST",
                body,
            }),
            invalidatesTags: ['Request']
        }),
        listRequest: builder.query<ListResponse<IRequest>, PageArgs>({
            query: ({ page = 1, limit = 10, search, userId }) =>
                `requests?page=${page}&limit=${limit}&search=${search}&userId=${userId}`,
            providesTags: (result, error, arg) =>
                result
                    ? [
                        ...result.docs.map(({ _id }) => ({
                            type: "Request" as const,
                            _id,
                        })),
                        "Request",
                    ]
                    : ["Request"],
        }),
        seenRequest: builder.mutation<IRequest, Pick<IRequest, "_id" | "isSeen">>({
            query: ({ _id, ...patch }) => ({
                url: `/request/seen/${_id}`,
                method: "PUT",
                body: patch
            }),
            invalidatesTags: (result, error, { _id }) => [{ type: "Request", _id }],
        })
    })
})

export const { useAddRequestMutation, useListRequestQuery, useSeenRequestMutation } = requestApi