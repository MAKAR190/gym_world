import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkout } from "@/client/contexts/WorkoutContext";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const WorkoutHeader = () => {
  const { isWorkoutActive, elapsedTime, clearWorkout } = useWorkout();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentRoute = useNavigationState(
    (state) => state?.routes[state.index]?.name
  );

  if (
    !isWorkoutActive ||
    currentRoute === "Workout" ||
    currentRoute === "Loading"
  )
    return null;

  return (
    <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-gray-200">
      <View className="flex-row items-center justify-between px-4 py-2 mt-12">
        <View className="flex-row items-center gap-x-4">
          <Pressable onPress={clearWorkout} className="flex-row items-center">
            <MaterialIcons name="arrow-back-ios" size={20} color="black" />
            <Text className="text-sm font-medium">Discard Workout</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Workout")}
            className="flex-row items-center"
          >
            <MaterialIcons name="fitness-center" size={20} color="black" />
            <Text className="ml-2 text-sm font-medium">Go back to Workout</Text>
          </Pressable>
        </View>
        <Text className="text-sm font-medium">{formatTime(elapsedTime)}</Text>
      </View>
    </View>
  );
};
