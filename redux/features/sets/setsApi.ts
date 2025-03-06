import { apiSlice } from "../api/apiSlice";

export const setsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createSet: builder.mutation({
            query: (data) => ({
                url: `create-set`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        getAllSets: builder.query({
            query: () => ({
                url: "get-all-sets",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getSetsByUserId: builder.mutation({
            query: (id) => ({
                url: `get-sets-by-userId`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getSetByFolderId: builder.mutation({
            query: (id) => ({
                url: `get-set-by-folderId/${id}`,
                method: "GET",
                credentials: "include" as const,
            }),
        })

    }),
});

export const {
    useCreateSetMutation,
    useGetAllSetsQuery,
    useGetSetsByUserIdMutation,
    useGetSetByFolderIdMutation,
} = setsApi;
