import { apiSlice } from "../api/apiSlice";

export const userStatisticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getStudyingSets: builder.query({
            query: () => ({
                url: `user-stats/getStudyingSets`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getRecentSets: builder.query({
            query: () => ({
                url: `user-stats/getRecentSets`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),

    }),
});

export const {
    useGetStudyingSetsQuery,
    useGetRecentSetsQuery,
} = userStatisticsApi;
