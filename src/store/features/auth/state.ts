export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string;
  statusId: number;
  roleId: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  message: string;
  user: User | null;
  loading: boolean;
  error: string | null;
  token?: string;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginSuccessPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
  success: boolean;
  message: string;
}

export interface MeResponse {
  id: string;
  username: string;
  email: string;
}
export const initialState: AuthState = {
  isAuthenticated: false,
  message: "",
  user: null,
  loading: false,
  error: null,
  token: "",
};
