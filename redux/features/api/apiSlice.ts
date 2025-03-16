import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

// Define tag types for the entire API
const tagTypes = ['Card', 'Set', 'FolderSets', 'AllSets', 'UserSets'] as const;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api-quizlearn.onrender.com/api/v1" }),
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
          // console.log("Full API response:", result);
          // console.log("API response data:", result.data);
          dispatch(
            userLoggedIn({
              accessToken: result?.data.accessToken,
              user: result?.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
