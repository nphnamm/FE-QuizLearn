import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { loginReducer } from "./features/auth/loginSlice";
import rootSaga from "./rootSaga";
import { signUpReducer } from "./features/signUp/signUpSlice";
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    login: loginReducer,
    signUp: signUpReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
