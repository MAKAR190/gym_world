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
