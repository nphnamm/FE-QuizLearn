import { apiSlice } from "../api/apiSlice";

export const setsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createSet: builder.mutation({
            query: (data) => ({
                url: `set/create-set`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        updateSet: builder.mutation({
            query: (data) => ({
                url: `set/update-set/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
        }),
        getAllSets: builder.query({
            query: () => ({
                url: "set/get-all-sets",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getSetsByUserId: builder.query({
            query: (id) => ({
                url: `set/get-sets-by-userId`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getSetByFolderId: builder.query({
            query: (id) => ({
                url: `set/get-sets-by-folderId/${id}`,
                method: "GET",
                credentials: "include" as const,
            }),
        })

    }),
});

export const {
    useCreateSetMutation,
    useUpdateSetMutation,
    useGetAllSetsQuery,
    useGetSetsByUserIdQuery,
    useGetSetByFolderIdQuery,
} = setsApi;
