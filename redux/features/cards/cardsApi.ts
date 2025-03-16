import { apiSlice } from "../api/apiSlice";

// Define tag types for proper type checking
type TagTypes = 'Card' | 'Set';

export const cardsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCard: builder.mutation({
            query: (data) => ({
                url: `/card/create-card`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            // Adding cache invalidation
            invalidatesTags: (result) => result?.card
                ? [
                    { type: 'Card', id: result.card.id },
                    { type: 'Set', id: result.card.setId }
                ]
                : []
        }),
        updateCard: builder.mutation({
            query: (data) => ({
                url: `/card/update-card/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
            // Adding cache invalidation
            invalidatesTags: (result, error, arg) => [
                { type: 'Card', id: arg.id },
                { type: 'Set', id: arg.setId }
            ]
        }),
        getCardBySetId: builder.query({
            query: (id) => ({
                url: `/card/get-all-card-by-setId/${id}`,
                credentials: "include" as const,
            }),
            // Adding providesTags for cache invalidation
            providesTags: (result, error, id) =>
                result?.sets
                    ? [
                        ...result.sets.map(({ id }: { id: string }) => ({ type: 'Card' as const, id })),
                        { type: 'Card', id }
                    ]
                    : [{ type: 'Card', id }]
        }),
    }),
});

export const {
    useCreateCardMutation,
    useUpdateCardMutation,
    useGetCardBySetIdQuery
} = cardsApi;
