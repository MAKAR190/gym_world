import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { useAuth } from "@/client/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, isLoading } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkSession = async () => {
      if (!isLoading && !session) {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        if (!currentSession) {
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }, 0);
        }
      }
    };

    checkSession();
  }, [session, isLoading, navigation]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
