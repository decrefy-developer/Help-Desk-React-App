import { createApi } from "@reduxjs/toolkit/query/react";
import { IDepartment, IFormInputDepartment, IUnit, ListResponse, PageArgs } from "../../models/interface";
import { baseQuery } from "../../services/auth-header";



export const departmentApi = createApi({
    reducerPath: "departmentApi",
    baseQuery: baseQuery,
    tagTypes: ["Department", "Unit"],
    endpoints: (builder) => ({
        listDepartment: builder.query<ListResponse<IDepartment>, PageArgs>({
            query: ({ page = 1, limit = 10, search = "", status }) =>
                `departments?page=${page}&limit=${limit}&search=${search}&status=${status}`,
            providesTags: (result, error, arg) =>
                result
                    ? [
                        ...result.docs.map(({ _id }) => ({
                            type: "Department" as const,
                            _id,
                        })),
                        "Department",
                    ]
                    : ["Department"],
        }),
        addDepartment: builder.mutation<IDepartment, IFormInputDepartment>({
            query: (body) => ({
                url: "/department",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Department"],
        }),
        changeStatus: builder.mutation<IDepartment, Partial<IDepartment>>({
            query: ({ _id, ...patch }) => ({
                url: `/department/status/${_id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (result, error, { _id }) => [{ type: "Department", _id }],
        }),
        listUnit: builder.query<ListResponse<IUnit>, PageArgs>({
            query: ({ page = 1, limit = 10, search = "", status, departmentId }) =>
                `units?page=${page}&limit=${limit}&search=${search}&status=${status}&departmentId=${departmentId}`,
            providesTags: (result, error, arg) =>
                result
                    ? [
                        ...result.docs.map(({ _id }) => ({
                            type: "Unit" as const,
                            _id,
                        })),
                        "Unit",
                    ]
                    : ["Unit"],
        }),
        addUnit: builder.mutation<IUnit, { departmentId: string, name: string }>({
            query: (body) => ({
                url: "/unit",
                method: "POST",
                body
            }),
            invalidatesTags: ["Unit"]
        }),
        changeUnitStatus: builder.mutation<IUnit, Pick<IUnit, "_id" | "isActive">>({
            query: ({ _id, ...patch }) => ({
                url: `/unit/status/${_id}`,
                method: "PUT",
                body: patch
            }),
            invalidatesTags: (result, error, { _id }) => [{ type: "Unit", _id }]
        })
    })
})


export const {
    useListDepartmentQuery,
    useAddDepartmentMutation,
    useChangeStatusMutation,
    useListUnitQuery,
    useAddUnitMutation,
    useChangeUnitStatusMutation
} = departmentApi