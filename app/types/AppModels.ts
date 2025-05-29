import { User, Session } from "@supabase/auth-js";

export type RootStackParamList = {
  Login: undefined;
  Tabs: { screen: "Profile" } | { screen: "Add" };
  ForgotPassword: undefined;
  SignUp: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Loading: undefined;
  Workout: undefined;
  WorkoutHistory: undefined;
  Exercises: undefined;
  WorkoutStats: undefined;
  Comments: { workoutId: string };
};

export interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: Error | null;
}
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export enum AppErrorCodes {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_NOT_CREATED = "USER_NOT_CREATED",
  GET_CURRENT_USER_FAILED = "GET_CURRENT_USER_FAILED",
  UPDATE_USER_FAILED = "UPDATE_USER_FAILED",
  DELETE_USER_FAILED = "DELETE_USER_FAILED",
  USER_CREDENTIALS_DO_NOT_MATCH = "USER_CREDENTIALS_DO_NOT_MATCH",
  SIGN_UP_FAILED = "SIGN_UP_FAILED",
  SIGN_IN_FAILED = "SIGN_IN_FAILED",
  SIGN_OUT_FAILED = "SIGN_OUT_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  FETCH_WORKOUTS_FAILED = "FETCH_WORKOUTS_FAILED",
  CREATE_WORKOUT_FAILED = "CREATE_WORKOUT_FAILED",
  CREATE_SETS_FAILED = "CREATE_SETS_FAILED",
  CREATE_EXERCISE_WORKOUT_FAILED = "CREATE_EXERCISE_WORKOUT_FAILED",
  FETCH_WORKOUT_EXERCISES_FAILED = "FETCH_WORKOUT_EXERCISES_FAILED",
  UPDATE_WORKOUT_FAILED = "UPDATE_WORKOUT_FAILED",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FETCH_EXERCISES_FAILED = "FETCH_EXERCISES_FAILED",
  FETCH_SETS_FAILED = "FETCH_SETS_FAILED",
  FETCH_EXERCISE_BY_ID_FAILED = "FETCH_EXERCISE_BY_ID_FAILED",
  FETCH_SETS_BY_EXERCISE_ID_FAILED = "FETCH_SETS_BY_EXERCISE_ID_FAILED",
  FETCH_WORKOUT_BY_ID_FAILED = "FETCH_WORKOUT_BY_ID_FAILED",
  USER_WALLET_NOT_FOUND = "USER_WALLET_NOT_FOUND",
  REWARD_WORKOUT_FAILED = "REWARD_WORKOUT_FAILED",
  GET_TOKEN_BALANCE_FAILED = "GET_TOKEN_BALANCE_FAILED",
  CREATE_COMMENT_FAILED = "CREATE_COMMENT_FAILED",
  FETCH_COMMENTS_FAILED = "FETCH_COMMENTS_FAILED",
  DELETE_COMMENT_FAILED = "DELETE_COMMENT_FAILED",
  FETCH_REPLIES_FAILED = "FETCH_REPLIES_FAILED",
}

export const AppErrorMessages = {
  [AppErrorCodes.USER_NOT_FOUND]: "User not found",
  [AppErrorCodes.USER_ALREADY_EXISTS]: "User already exists",
  [AppErrorCodes.USER_NOT_CREATED]: "User not created",
  [AppErrorCodes.GET_CURRENT_USER_FAILED]: "Get current user failed",
  [AppErrorCodes.UPDATE_USER_FAILED]: "Update user failed",
  [AppErrorCodes.DELETE_USER_FAILED]: "Delete user failed",
  [AppErrorCodes.USER_CREDENTIALS_DO_NOT_MATCH]:
    "User credentials do not match",
  [AppErrorCodes.SIGN_UP_FAILED]: "Sign up failed",
  [AppErrorCodes.SIGN_IN_FAILED]: "Sign in failed",
  [AppErrorCodes.SIGN_OUT_FAILED]: "Sign out failed",
  [AppErrorCodes.UPDATE_WORKOUT_FAILED]: "Update workout failed",
  [AppErrorCodes.NETWORK_ERROR]: "Network error",
  [AppErrorCodes.UNKNOWN_ERROR]: "Unknown error",
  [AppErrorCodes.FETCH_WORKOUTS_FAILED]: "Fetch workouts failed",
  [AppErrorCodes.CREATE_WORKOUT_FAILED]: "Failed to create workout",
  [AppErrorCodes.CREATE_SETS_FAILED]: "Failed to create sets",
  [AppErrorCodes.CREATE_EXERCISE_WORKOUT_FAILED]:
    "Failed to create exercise-workout relationship",
  [AppErrorCodes.FETCH_WORKOUT_EXERCISES_FAILED]:
    "Fetch workout exercises failed",
  [AppErrorCodes.FILE_NOT_FOUND]: "File not found",
  [AppErrorCodes.FILE_TOO_LARGE]: "File size exceeds 25MB limit",
  [AppErrorCodes.INVALID_FILE_TYPE]: "Invalid file type",
  [AppErrorCodes.FETCH_EXERCISES_FAILED]: "Fetch exercises failed",
  [AppErrorCodes.FETCH_SETS_FAILED]: "Fetch sets failed",
  [AppErrorCodes.FETCH_EXERCISE_BY_ID_FAILED]: "Fetch exercise by id failed",
  [AppErrorCodes.FETCH_SETS_BY_EXERCISE_ID_FAILED]:
    "Fetch sets by exercise id failed",
  [AppErrorCodes.FETCH_WORKOUT_BY_ID_FAILED]: "Fetch workout by id failed",
  [AppErrorCodes.USER_WALLET_NOT_FOUND]: "User wallet not found",
  [AppErrorCodes.REWARD_WORKOUT_FAILED]: "Reward workout failed",
  [AppErrorCodes.GET_TOKEN_BALANCE_FAILED]: "Get token balance failed",
  [AppErrorCodes.CREATE_COMMENT_FAILED]: "Create comment failed",
  [AppErrorCodes.FETCH_COMMENTS_FAILED]: "Fetch comments failed",
  [AppErrorCodes.DELETE_COMMENT_FAILED]: "Delete comment failed",
  [AppErrorCodes.FETCH_REPLIES_FAILED]: "Fetch replies failed",
};
