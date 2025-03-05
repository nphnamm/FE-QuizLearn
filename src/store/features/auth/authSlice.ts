import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./state";

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchMeRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMeSuccess(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.loading = false;
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
