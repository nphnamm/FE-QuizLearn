import { apiSlice } from "../api/apiSlice";

export const imageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        searchImage: builder.mutation({
            query: (data) => ({
                url: `image/search-image`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        })

    }),
});

export const {
    useSearchImageMutation,
} = imageApi;
