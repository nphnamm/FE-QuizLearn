import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { NS_LOGIN, setLoginFailed, setLoginSuccess } from "./loginSlice";
import {
  LoginAuthReq,
  LoginSocialReq,
} from "@/services/requests/identityRequest";
import { loginApi, loginSocialApi } from "@/services/api/identityApi";

function* handleLogin(
  action: PayloadAction<{
    data: LoginAuthReq;
    callback: Function;
    callBackError?: Function;
  }>
): Generator<any, void, any> {
  try {
    const response = yield call(loginApi, action.payload.data);
    if (response?.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      yield put(setLoginSuccess(true));
      action.payload.callback();
    }
  } catch (error: any) {
    yield put(
      setLoginFailed({
        name: error.name,
        message: error.message,
      })
    );
    if (action.payload.callBackError) {
      action.payload.callBackError();
    }
  }
}

function* handleSocialLogin(
  action: PayloadAction<{
    data: LoginSocialReq;
    callback: Function;
  }>
): Generator<any, void, any> {
  try {
    const response = yield call(loginSocialApi, action.payload.data);
    if (response?.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      yield put(setLoginSuccess(true));
      action.payload.callback();
    }
  } catch (error: any) {
    yield put(
      setLoginFailed({
        name: error.name,
        message: error.message,
      })
    );
  }
}

export default function* loginSaga() {
  yield takeLatest(`${NS_LOGIN}/login`, handleLogin);
  yield takeLatest(`${NS_LOGIN}/socialLogin`, handleSocialLogin);
}
