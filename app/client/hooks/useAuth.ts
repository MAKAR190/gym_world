import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signUp, signIn, getCurrentUser } from "@/server/services/auth";
import { SignUpFormType, LoginFormType } from "@/types/FormModels";

const useSignUp = () => {
  return useMutation({
    mutationFn: (formData: SignUpFormType) => signUp({ data: formData }),
  });
};

const useSignIn = () => {
  return useMutation({
    mutationFn: (formData: LoginFormType) => signIn({ data: formData }),
  });
};

const useSession = () => {
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
    user: user?.user ?? session?.user,
    isLoading,
  };
};

const useRefreshSession = () => {
  return useMutation({
    mutationFn: () => supabase.auth.refreshSession(),
  });
};

const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.clear();
    },
  });
};

export default {
  useSignUp,
  useSignIn,
  useSession,
  useRefreshSession,
  useSignOut,
};
