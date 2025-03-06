import { apiSlice } from "../api/apiSlice";

export const foldersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createFolder: builder.mutation({
            query: (data) => ({
                url: `/folder/create-folder`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        getAllFolders: builder.query({
            query: () => ({
                url: "/folder/get-all-folders",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getFoldersByUserId: builder.query({
            query: () => ({
                url: `/folder/get-folders-by-userId`,
                method: "GET",
                credentials: "include" as const,
            }),
        })
    }),
});

export const {
    useCreateFolderMutation,
    useGetAllFoldersQuery,
    useGetFoldersByUserIdQuery,
  
} = foldersApi;
