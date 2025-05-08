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
        getStatisticOfSet: builder.query({
            query: (setId) => ({
                url: `user-stats/set/${setId}`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getUserStreak: builder.query({
            query: () => ({
                url: `user-streaks/streak`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useGetStudyingSetsQuery,
    useGetRecentSetsQuery,
    useGetStatisticOfSetQuery,
    useGetUserStreakQuery,
} = userStatisticsApi;
