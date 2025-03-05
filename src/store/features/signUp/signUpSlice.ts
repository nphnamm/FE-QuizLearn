import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState, { RegisterInfo } from "./state";
import { RegisterRequest, RegisterResponse, VerifyEmailRequest } from "@/services/requests/identityRequest";
import { VerifyEmailResponse } from "@/services/responses/identityResponse";

export const NS_SIGN_UP = "signUp";

const signUpSlice = createSlice({
    name: NS_SIGN_UP,
    initialState,
    reducers: {
        register(_:RegisterInfo , __: PayloadAction<{ data: RegisterRequest; callback: Function }>) {},
        saveRegisterInfo(state: RegisterInfo, { payload }: PayloadAction<RegisterResponse>) {
            state.token = payload.activationToken;
        },
 
        verificationEmail(state: RegisterInfo, { payload }: PayloadAction<VerifyEmailResponse>) {
            state.user = payload.user;
        },

    },
});

// Actions
export const {
    register,
    saveRegisterInfo,
    verificationEmail
} = signUpSlice.actions;

// Reducer
export const signUpReducer = signUpSlice.reducer;
