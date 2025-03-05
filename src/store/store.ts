import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";
import { signUpReducer } from "./features/signUp/signUpSlice";
import authReducer from "./features/auth/authSlice";
import loginReducer from "./features/signIn/loginSlice";
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    login: loginReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
