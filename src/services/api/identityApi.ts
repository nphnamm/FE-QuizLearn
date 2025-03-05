import axios from "axios";
import {
  LoginAuthReq,
  LoginSocialReq,
  RegisterRequest,
  VerifyEmailRequest,
} from "../requests/identityRequest";
import { LoginPayload } from "@/store/features/auth/state";

const API_URL = "http://localhost:8000/api/v1";
export const loginApi = async (data: LoginAuthReq) => {
  return axios.post(`${API_URL}/auth/login`, data);
};
export const logoutApi = async () => {
  return axios.post(`${API_URL}/auth/logout`);
};

export const loginSocialApi = async (data: LoginSocialReq) => {
  return axios.post(`${API_URL}/auth/social-login`, data);
};

export const registerApi = async (data: RegisterRequest) => {
  return axios.post(`${API_URL}/auth/sign-up`, data);
};

export const verifyEmailApi = async (data: VerifyEmailRequest) => {
  return axios.post(`${API_URL}/auth/activation`, data);
};
