import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signUp, signIn, getCurrentUser } from "@/server/services/auth";
import { SignUpFormType, LoginFormType } from "@/types/FormModels";
import { useEffect } from "react";
    
const useSignUp = () => {
  return useMutation({
    mutationFn: (formData: SignUpFormType) => signUp({ data: formData }),
  });
};

const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: LoginFormType) => signIn({ data: formData }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await new Promise((resolve) => setTimeout(resolve, 100));
    },
  });
};


const useSession = () => {

  const {
    data: session,
    isLoading: isSessionLoading,
    refetch,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      console.log("Fetching session...");
      const {
        data: { session: sessionData },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return null;
      }

      console.log("Session fetch result:", sessionData);
      return sessionData;
    },
    gcTime: 0,
    staleTime: 0,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!session,
    gcTime: 0,
    staleTime: 0,
    retry: false,
  });

  // Log session state changes
  useEffect(() => {
    console.log("Session state changed:", { session, isSessionLoading });
  }, [session, isSessionLoading]);

  useEffect(() => {
    refetch();
  }, [refetch]);


  return {
    session,
    user: user?.user ?? session?.user,
    isLoading: isSessionLoading || (!!session && isUserLoading),
    refetch,
  };
};

const useRefreshSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data.session);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("Starting sign out process...");

      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase sign out error:", error);
        throw error;
      }

      console.log("Supabase sign out successful");

      // Clear all queries and cache
      queryClient.clear();
      console.log("Query cache cleared");

      // Explicitly set session and user data to null
      queryClient.setQueryData(["session"], null);
      queryClient.setQueryData(["user"], null);
      console.log("Session and user data set to null");

      // Force refetch the session to ensure state is updated
      await queryClient.refetchQueries({
        queryKey: ["session"],
        type: "active",
        exact: true,
      });
      console.log("Session refetched");

      // Additional check to ensure session is null
      const {
        data: { session: finalSession },
      } = await supabase.auth.getSession();
      console.log("Final session check:", finalSession);

      if (finalSession) {
        console.error("Session still exists after sign out!");
        // Force clear the session again
        queryClient.setQueryData(["session"], null);
      }

      // Force a refetch after a short delay to ensure state is updated
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["session"] });
      }, 100);
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
