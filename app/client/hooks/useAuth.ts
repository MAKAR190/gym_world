import { useMutation, useQuery } from "@tanstack/react-query";
import { signUp, signIn, getCurrentUser } from "@/server/services/auth";
import { SignUpFormType, LoginFormType } from "@/types/FormModels";
import { supabase } from "@/lib/supabase";

export const useSignUp = () => {
  return useMutation({
    mutationFn: (formData: SignUpFormType) => signUp({ data: formData }),
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: (formData: LoginFormType) => signIn({ data: formData }),
  });
};

export const useSession = () => {
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session: sessionData },
      } = await supabase.auth.getSession();
      return sessionData;
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!session,
  });

  return {
    session,
    user: user?.user,
    isLoading,
  };
};
