import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState, { LoginState } from "./state";
import {
  LoginAuthReq,
  LoginSocialReq,
} from "@/services/requests/identityRequest";

export const NS_LOGIN = "login";

const loginSlice = createSlice({
  name: NS_LOGIN,
  initialState,
  reducers: {
    login(
      _: LoginState,
      __: PayloadAction<{
        data: LoginAuthReq;
        callback: Function;
        callBackError?: Function;
      }>
    ) {},
    socialLogin(
      _: LoginState,
      __: PayloadAction<{ data: LoginSocialReq; callback: Function }>
    ) {},
    logout(state: LoginState) {
      state.isLogin = false;
      state.errorMessage = { name: "", message: "" };
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
    setLoginSuccess(state: LoginState, { payload }: PayloadAction<boolean>) {
      state.isLogin = payload;
    },
    setLoginFailed(
      state: LoginState,
      { payload }: PayloadAction<{ name: string; message: string }>
    ) {
      state.errorMessage = payload;
    },
  },
});

// Actions
export const { login, socialLogin, logout, setLoginSuccess, setLoginFailed } =
  loginSlice.actions;

// Reducer
export const loginReducer = loginSlice.reducer;
