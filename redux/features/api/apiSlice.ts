import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

// Define tag types for the entire API
const tagTypes = ['Card', 'Set', 'FolderSets', 'AllSets', 'UserSets'] as const;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_SERVER_URI }),
  tagTypes: tagTypes,
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: (data) => ({
        url: "auth/refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "auth/me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result?.data.accessToken,
              user: result?.data.user,
            })
          );
        } catch (error: any) {
          // If the error is 400, try to refresh the token
          if (error?.response?.status === 400) {
            try {
              const refreshResult = await dispatch(
                apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
              );
              
              if ('data' in refreshResult) {
                // Update the store with the new token
                dispatch(
                  userLoggedIn({
                    accessToken: refreshResult.data.accessToken,
                    user: refreshResult.data.user,
                  })
                );
                // The original query will automatically retry with the new token
                // No need to explicitly call loadUser again
              }
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              // If refresh fails, log the user out
              dispatch(userLoggedOut());
            }
          } else {
            console.error('Error loading user:', error);
          }
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
