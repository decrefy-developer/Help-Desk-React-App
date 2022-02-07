import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IFormInputMember,
  IMember,
  ITeamChannel,
  ListResponse,
  PageArgs,
} from "../models/interface";
import { baseQuery } from "../services/auth-header";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: baseQuery,
  tagTypes: ["Member"],
  endpoints: (builder) => ({
    listMember: builder.query<ListResponse<IMember>, PageArgs>({
      query: ({ page = 1, limit = 10, search = "", status }) =>
        `user?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.docs.map(({ _id }) => ({
                type: "Member" as const,
                _id,
              })),
              "Member",
            ]
          : ["Member"],
    }),
    getMember: builder.query<IMember, string>({
      query: (_id) => `user/${_id}`,
      providesTags: (result, error, _id) => [{ type: "Member", _id }],
    }),
    addMember: builder.mutation<IMember, IFormInputMember>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Member"],
    }),
    ChannelsOfTheUser: builder.query<ITeamChannel[], string>({
      query: (id) => `team/user/${id}`,
    }),
    updateMemberAcess: builder.mutation<
      IMember,
      Pick<IMember, "_id"> & Partial<IMember>
    >({
      query: ({ _id, ...patch }) => ({
        url: `/user/${_id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ _id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          memberApi.util.updateQueryData("getMember", _id, (draft) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { _id }) => [{ type: "Member", _id }],
    }),
    resetPassword: builder.mutation<IMember, Pick<IMember, "_id">>({
      query: ({ _id }) => ({
        url: `/user/password/${_id}`,
        method: "PUT",
      }),
    }),
    changeAccountStatus: builder.mutation<IMember, Partial<IMember>>({
      query: ({ _id, ...patch }) => ({
        url: `/user/status/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "Member", _id }],
    }),
  }),
});

export const {
  useListMemberQuery,
  useGetMemberQuery,
  useAddMemberMutation,
  useChannelsOfTheUserQuery,
  useUpdateMemberAcessMutation,
  useResetPasswordMutation,
  useChangeAccountStatusMutation,
} = memberApi;
