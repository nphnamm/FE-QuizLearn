"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import layoutReducer from "./features/layout/layoutSlice";
import { localStorageMiddleware, loadState } from "./middlewares/localStorage";

// Load preloaded state from localStorage
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    layout: layoutReducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, localStorageMiddleware),
});

const initializeApp = async () => {
  try {
    await store.dispatch(
      apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
    );
    
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
  } catch (error) {
    console.error("Failed to initialize authentication:", error);
  }
};
initializeApp();

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
