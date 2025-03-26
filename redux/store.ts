"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import layoutReducer from "./features/layout/layoutSlice";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Define root reducer with all reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice,
  layout: layoutReducer,
});

// Redux Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['layout'], // Only persist layout for now
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persister
export const persistor = persistStore(store);

const initializeApp = async () => {
  try {
    // await store.dispatch(
    //   apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
    // );
  } catch (error) {
    console.error("Failed to initialize authentication:", error);
  }
};
initializeApp();

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
