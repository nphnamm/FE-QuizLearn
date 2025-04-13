import { apiSlice } from "../api/apiSlice";

export const userSessionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrUpdateUserSession: builder.mutation({
            query: (data) => ({
                url: `session/create-or-resume`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        getRandomAnswerChoices: builder.query({
            query: (data) => ({
                url: `session/get-multiple-choices/${data.setId}/${data.cardId}`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        createOrResumeTest: builder.query({
            query: (data) => ({
                url: `session/start-test/${data}`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useCreateOrUpdateUserSessionMutation,
    useGetRandomAnswerChoicesQuery, 
    useCreateOrResumeTestQuery
} = userSessionsApi;
