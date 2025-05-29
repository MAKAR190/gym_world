import React from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { useWorkout } from "@/client/contexts/WorkoutContext";

interface ProtectedWorkoutRouteProps {
  children: React.ReactNode;
}

export const ProtectedWorkoutRoute = ({
  children,
}: ProtectedWorkoutRouteProps) => {
  const { isWorkoutActive } = useWorkout();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      if (!isWorkoutActive) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs", params: { screen: "Add" } }],
        });
      }
    }, [isWorkoutActive, navigation])
  );

  return <>{children}</>;
};
