import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startTokenRefreshTimer, stopTokenRefreshTimer } from "../../../src/utils/apiClient";

const initialState = {
    user: "",
    token: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            // console.log(action.payload.token)
            state.token = action.payload.token;
        },
        userLoggedIn: (state, action: PayloadAction<{ accessToken: string; user: string }>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            // We don't need to start the timer here as it's handled in the AuthProvider
        },
        userLoggedOut: (state) => {
            state.token = "";
            state.user = "";
            // Stop token refresh timer when logging out
            stopTokenRefreshTimer();
        },
        tokenRefreshed: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.token = action.payload.accessToken;
            // We don't need to restart the timer here as it's handled in the apiClient
        },
    },
});

export const { userRegistration, userLoggedIn, userLoggedOut, tokenRefreshed } = authSlice.actions;
export default authSlice.reducer;
