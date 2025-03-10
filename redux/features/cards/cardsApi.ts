import { apiSlice } from "../api/apiSlice";

export const cardsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({  
        createCard: builder.mutation({
            query: (data) => ({
                url: `/card/create-card`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        updateCard: builder.mutation({
            query: (data) => ({
                url: `/card/update-card/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
        }),
        getCardBySetId: builder.query({
            query: (id) => ({
                url: `/card/get-all-card-by-setId/${id}`,
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useCreateCardMutation,
    useUpdateCardMutation,
    useGetCardBySetIdQuery
} = cardsApi;
