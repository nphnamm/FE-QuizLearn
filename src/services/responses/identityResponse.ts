import { BaseUserRsp } from "./base/baseResponse";

export interface LoginAuthRsp {
  data: {
    accessToken: string;
    refreshToken: string;
    isRequired2Fa: boolean;
  };
}

export type RegistrationResponse = {
  succues?: boolean;
  message?: string;
  activationToken: string;
};

export type VerifyEmailResponse = {
  success: boolean;
  user: BaseUserRsp;
};

export type MeResponse = {
  success: boolean;
  user: BaseUserRsp;
};
