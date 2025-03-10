import { apiSlice } from "../api/apiSlice";

export const userProgressesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateProgress: builder.mutation({
            query: (data) => ({
                url: `user-progress/update-progress`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        })

    }),
});

export const {
    useUpdateProgressMutation,

} = userProgressesApi;
