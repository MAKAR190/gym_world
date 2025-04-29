import { User } from "@supabase/supabase-js";

export type RootStackParamList = {
  Login: undefined;
  Tabs: { screen: "Profile" };
  Add: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  Profile: undefined;
};

export interface AuthResponse {
  data: {
    user: User | null;
  };
  error: Error | null;
}

export enum AppErrorCodes {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_NOT_CREATED = "USER_NOT_CREATED",
  GET_CURRENT_USER_FAILED = "GET_CURRENT_USER_FAILED",
  USER_CREDENTIALS_DO_NOT_MATCH = "USER_CREDENTIALS_DO_NOT_MATCH",
  SIGN_UP_FAILED = "SIGN_UP_FAILED",
  SIGN_IN_FAILED = "SIGN_IN_FAILED",
  SIGN_OUT_FAILED = "SIGN_OUT_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export const AppErrorMessages = {
  [AppErrorCodes.USER_NOT_FOUND]: "User not found",
  [AppErrorCodes.USER_ALREADY_EXISTS]: "User already exists",
  [AppErrorCodes.USER_NOT_CREATED]: "User not created",
  [AppErrorCodes.GET_CURRENT_USER_FAILED]: "Get current user failed",
  [AppErrorCodes.USER_CREDENTIALS_DO_NOT_MATCH]: "User credentials do not match",
  [AppErrorCodes.SIGN_UP_FAILED]: "Sign up failed",
  [AppErrorCodes.SIGN_IN_FAILED]: "Sign in failed",
  [AppErrorCodes.SIGN_OUT_FAILED]: "Sign out failed",
  [AppErrorCodes.NETWORK_ERROR]: "Network error",
  [AppErrorCodes.UNKNOWN_ERROR]: "Unknown error",
};