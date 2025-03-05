export interface LoginState {
  isLogin: boolean;
  errorMessage: {
    name: string;
    message: string;
  };
}

const initialState: LoginState = {
  isLogin: false,
  errorMessage: {
    name: "",
    message: "",
  },
};

export default initialState;
