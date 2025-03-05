import { call, put, takeLatest, select } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import { fetchMeFailure, fetchMeRequest, fetchMeSuccess } from "./authSlice";
import { logoutRequest } from "../signIn/loginSlice";
import { MeResponse } from "@/services/responses/identityResponse";

const fetchMeApi = (accessToken: string) => {
  return axios.get("YOUR_API_ENDPOINT/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

function* handleFetchMe(): Generator<any, void, any> {
  try {
    const state = yield select((state) => state.auth);
    const { accessToken } = state;

    if (!accessToken) {
      yield put(fetchMeFailure("No access token found"));
      yield put(logoutRequest());
      return;
    }

    const response: AxiosResponse<MeResponse> = yield call(
      fetchMeApi,
      accessToken
    );
    yield put(fetchMeSuccess(response.data));
  } catch (error: any) {
    yield put(
      fetchMeFailure(
        error.response?.data?.message || "Failed to fetch user info"
      )
    );
    yield put(logoutRequest()); // Logout nếu /me thất bại
  }
}

export function* authSaga() {
  yield takeLatest(fetchMeRequest.type, handleFetchMe);
}
