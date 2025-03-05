import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./state";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetchMeRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMeSuccess(state, action: PayloadAction<any>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loading = false;
      state.token = action.payload.accessToken;
    },
    fetchMeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },
    clearUser(state) {
      return initialState;
    },
  },
});

export const { fetchMeRequest, fetchMeSuccess, fetchMeFailure, clearUser } =
  authSlice.actions;
export default authSlice.reducer;
