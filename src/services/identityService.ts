import axios from "axios";
import {
  LoginAuthReq,
  LoginSocialReq,
  RegisterRequest,
  VerifyEmailRequest,
} from "./requests/identityRequest";
import { loginApi, loginSocialApi, registerApi, verifyEmailApi } from "./api/identityApi";

const userService = {
  login: async (data: LoginAuthReq) => {
    const response = await loginApi(data);
    return response.data;
  },
  socialLogin: async (data: LoginSocialReq) => {
    const response = await loginSocialApi(data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await registerApi(data);
    return response.data;
  },
  verifyEmail: async (data: VerifyEmailRequest) => {
    const response = await verifyEmailApi(data);
    return response.data;
  },
};

export default userService;
