import { call, put, takeLatest, select } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";

import { PayloadAction } from "@reduxjs/toolkit";
import { LoginPayload, LoginSuccessPayload } from "../auth/state";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutFailure,
  logoutRequest,
  logoutSuccess,
} from "./loginSlice";
import { clearUser } from "../auth/authSlice";
import { logoutApi } from "@/services/api/identityApi";
const API_URL = "http://localhost:8000/api/v1";
const loginApi = async (data: LoginPayload) => {
  return axios.post(`${API_URL}/auth/login`, data);
};
function* handleLogin(
  action: PayloadAction<LoginPayload>
): Generator<any, void, any> {
  try {
    const response: AxiosResponse<LoginSuccessPayload> = yield call(
      loginApi,
      action.payload
    );
    const { accessToken, refreshToken } = response.data;

    yield put(
      loginSuccess({
        accessToken,
        refreshToken,
      })
    );
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.message || "Login failed"));
  }
}

function* handleLogout(): Generator<any, void, any> {
  try {
    const state = yield select((state) => state.auth);
    const { accessToken } = state;

    if (accessToken) {
      yield call(logoutApi);
    }

    yield put(logoutSuccess());
    yield put(clearUser()); // Reset user state khi logout
  } catch (error: any) {
    yield put(logoutFailure(error.response?.data?.message || "Logout failed"));
  }
}

export function* loginSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
}
