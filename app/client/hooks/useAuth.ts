import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signUp, signIn, getCurrentUser } from "@/server/services/auth";
import { SignUpFormType, LoginFormType } from "@/types/FormModels";
import { useWallet } from "@/client/contexts/WalletContext";
import { useEffect } from "react";
import { User as DatabaseUser } from "@/types/DatabaseModels";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";

const useSignUp = () => {
  return useMutation({
    mutationFn: (formData: SignUpFormType) => signUp({ data: formData }),
  });
};

const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return useMutation({
    mutationFn: (formData: LoginFormType) => signIn({ data: formData }),
    onSuccess: () => {
      // Invalidate queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Navigate to Login screen first, then to Tabs
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      // Use setTimeout to ensure navigation happens after the stack is ready
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs", params: { screen: "Profile" } }],
        });
      }, 0);
    },
  });
};

// Custom hook to safely use wallet context
const useSafeWallet = () => {
  try {
    return useWallet();
  } catch {
    return null;
  }
};

const useSession = () => {
  const wallet = useSafeWallet();

  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session: sessionData },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return null;
      }

      return sessionData;
    },
    gcTime: Infinity,
    staleTime: Infinity,
    retry: false,
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!session,
    gcTime: Infinity,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (!wallet) return;

    const dbUser = user?.user as DatabaseUser | null;
    const isWalletConnected = session?.user?.user_metadata?.wallet_connected;

    if (
      dbUser?.wallet_address &&
      !wallet.walletAddress &&
      isWalletConnected !== false
    ) {
      wallet.setWalletAddress(dbUser.wallet_address);
    }
  }, [user?.user, wallet, session?.user?.user_metadata?.wallet_connected]);

  return {
    session,
    user: user?.user ?? session?.user,
    isLoading,
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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Only clear the cache when explicitly signing out
      queryClient.clear();
      // Navigate to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
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
