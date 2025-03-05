export interface LoginAuthReq {
  email: string;
  password: string;
}

export interface LoginSocialReq {
  provider: "google" | "github";
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  succues: boolean;
  message: string;
  activationToken: string;
}


export interface VerifyEmailRequest {
  activation_token: string;
  activation_code: string;
}

