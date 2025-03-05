import userService from "@/services/identityService";
import { TAction } from "@/types";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { register, saveRegisterInfo, verificationEmail } from "./signUpSlice";
import { setLoginSuccess } from "../auth/loginSlice";
import { RegisterInfo } from "./state";
import { RegisterRequest } from "@/services/requests/identityRequest";

function* handleRegister({ payload: { data, callback } }: TAction) {
    try {
        const rest: RegisterRequest = yield call(userService.register, {
            ...data,
        });
    } catch (err: any) {
        console.error(err);
        const { message } = err.data.message;

    }
}
    
function* handleVerificationEmail({ payload: { data, callback } }: TAction) {
    try {
         yield call(setLoginSuccess,true);
    } catch (err: any) {
        console.error(err);
        const { message } = err.data.message;
    }
}
export default function* signUpSaga() {
    yield takeLatest(register, handleRegister);
    yield takeLatest(verificationEmail.type, handleVerificationEmail);

}


