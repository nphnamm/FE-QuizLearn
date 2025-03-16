import { apiSlice } from "../api/apiSlice";

// Define tag types for proper type checking
type TagTypes = 'Set' | 'FolderSets' | 'AllSets' | 'UserSets';

export const setsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createSet: builder.mutation({
            query: (data) => ({
                url: `set/create-set`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            // Add cache invalidation
            invalidatesTags: (result) => result?.set?.id 
                ? [
                    { type: 'Set' as TagTypes, id: result.set.id },
                    { type: 'FolderSets' as TagTypes, id: result.set.folderId }
                  ]
                : []
        }),
        updateSet: builder.mutation({
            query: (data) => ({
                url: `set/update-set/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
            // Add cache invalidation
            invalidatesTags: (result, error, arg) => [
                { type: 'Set' as TagTypes, id: arg.id },
                { type: 'FolderSets' as TagTypes, id: arg.folderId },
                { type: 'AllSets' as TagTypes }
            ]
        }),
        deleteSet: builder.mutation({
            query: (id) => ({
                url: `set/delete-set/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
            // Add cache invalidation
            invalidatesTags: (result, error, id) => [
                { type: 'Set' as TagTypes, id },
                { type: 'FolderSets' as TagTypes },
                { type: 'AllSets' as TagTypes }
            ]
        }),
        getAllSets: builder.query({
            query: () => ({
                url: "set/get-all-sets",
                method: "GET",
                credentials: "include" as const,
            }),
            // Add cache tags
            providesTags: (result) => 
                result?.sets 
                    ? [
                        ...result.sets.map(({ id }: { id: string }) => ({ type: 'Set' as TagTypes, id })),
                        { type: 'AllSets' as TagTypes }
                      ]
                    : [{ type: 'AllSets' as TagTypes }]
        }),
        getSetsByUserId: builder.query({
            query: (id) => ({
                url: `set/get-sets-by-userId`,
                method: "GET",
                credentials: "include" as const,
            }),
            // Add cache tags
            providesTags: (result) => 
                result?.sets 
                    ? [
                        ...result.sets.map(({ id }: { id: string }) => ({ type: 'Set' as TagTypes, id })),
                        { type: 'UserSets' as TagTypes }
                      ]
                    : [{ type: 'UserSets' as TagTypes }]
        }),
        getSetByFolderId: builder.query({
            query: (id) => ({
                url: `set/get-sets-by-folderId/${id}`,
                method: "GET",
                credentials: "include" as const,
            }),
            // Add cache tags
            providesTags: (result, error, id) => 
                result?.sets 
                    ? [
                        ...result.sets.map(({ id }: { id: string }) => ({ type: 'Set' as TagTypes, id })),
                        { type: 'FolderSets' as TagTypes, id }
                      ]
                    : [{ type: 'FolderSets' as TagTypes, id }]
        })
    }),
});

export const {
    useCreateSetMutation,
    useUpdateSetMutation,
    useDeleteSetMutation,
    useGetAllSetsQuery,
    useGetSetsByUserIdQuery,
    useGetSetByFolderIdQuery,
} = setsApi;
