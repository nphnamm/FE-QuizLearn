import { all } from "redux-saga/effects";
import loginSaga from "./features/auth/loginSaga";

export default function* rootSaga() {
  yield all([loginSaga()]);
}
