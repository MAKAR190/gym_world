import { supabase } from "@/lib/supabase";
import { User } from "@supabase/auth-js";
import { LoginFormType, SignUpFormType } from "@/types/FormModels";
import { formDataToDatabase, isEmail } from "@/utils/helpers";
import { AppErrorCodes, AuthResponse } from "@/types/AppModels";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constants";

export const signUp = async ({
  data: formData,
}: {
  data: SignUpFormType;
}): Promise<AuthResponse> => {
  const isEmailInput = isEmail(formData.emailOrUsername);

  const provider = isEmailInput ? "email" : "username";

  const placeholderEmail = `${formData.emailOrUsername}@gymworld.com`;

  const formToDatabase = formDataToDatabase(formData);
  delete formToDatabase.emailOrUsername;
  delete formToDatabase.password;

  const formDataToInsert = {
    ...formToDatabase,
    username: isEmailInput ? null : formData.emailOrUsername,
    email: isEmailInput ? formData.emailOrUsername : null,
    profile_picture: DEFAULT_PROFILE_PICTURE,
    bio: "No bio, just working out",
    provider,
  };

  const { data, error } = await supabase.auth.signUp({
    email: isEmailInput ? formData.emailOrUsername : placeholderEmail,
    password: formData.password,
    options: {
      data: {
        provider,
        username: formDataToInsert.username,
      },
    },
  });

  if (error) {
    throw AppErrorCodes.SIGN_UP_FAILED;
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: data?.user?.id,
    ...formDataToInsert,
  });

  if (insertError) {
    throw AppErrorCodes.USER_NOT_CREATED;
  }

  return { data, error: null };
};

export const signIn = async ({
  data: formData,
}: {
  data: LoginFormType;
}): Promise<AuthResponse> => {
  const { emailOrUsername, password } = formData;

  const isEmailInput = isEmail(emailOrUsername);

  let login = emailOrUsername;

  if (!isEmailInput) {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("username", emailOrUsername)
      .single();

    if (userError || !user) {
      throw new Error("Username not found");
    }

    login = `${user.username.toLowerCase()}@gymworld.com`;
  }

  const { data: authUser, error } = await supabase.auth.signInWithPassword({
    email: login,
    password,
  });

  if (error) {
    throw AppErrorCodes.SIGN_IN_FAILED;
  }

  if (!isEmailInput) {
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("username")
      .eq("id", authUser.user.id)
      .single();

    if (userDataError || !userData) {
      throw AppErrorCodes.USER_NOT_FOUND;
    }

    if (userData.username !== emailOrUsername) {
      throw AppErrorCodes.USER_CREDENTIALS_DO_NOT_MATCH;
    }
  }

  return { data: authUser, error: null };
};

export const signInWithGoogle = async (): Promise<{
  data: { provider: string; url: string };
  error: null;
}> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    throw AppErrorCodes.SIGN_IN_FAILED;
  }

  return { data, error: null };
};

export const getCurrentUser = async (): Promise<{ user: User | null }> => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user.id) return { user: null };

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", sessionData.session.user.id)
    .single();

  if (error) throw AppErrorCodes.GET_CURRENT_USER_FAILED;
  return { user: data };
};