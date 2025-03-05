import { all } from "redux-saga/effects";
import { authSaga } from "./features/auth/authSaga";
import { loginSaga } from "./features/signIn/loginSaga";
export default function* rootSaga() {
  yield all([loginSaga(), authSaga()]);
}
