import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Title, Button } from "@/client/components";
import { AntDesign } from "@expo/vector-icons";
import { AlertDialog as DiscardWorkoutDialog } from "@/client/components/Dialogs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { useWorkout } from "@/client/contexts/WorkoutContext";
import { Exercise, Set } from "@/types/DatabaseModels";
import { Image } from "expo-image";
import { auth } from "@/client/hooks";
import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { uploadWorkoutPhoto } from "@/server/services/workouts";

const Workout = () => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    selectedExercises,
    elapsedTime,
    removeExercise,
    clearWorkout,
    exerciseSets,
    setExerciseSets,
    endWorkout,
    isLoading,
  } = useWorkout();
  const { user } = auth.useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const parseTimeInput = (value: string): number => {
    const [hours = "0", minutes = "0", seconds = "0"] = value
      .split(":")
      .map((v) => v.trim());
    return (
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(seconds, 10)
    );
  };

  const calculateTotalVolume = () => {
    return exerciseSets.reduce((total, set) => {
      if (set.weight) return total + set.weight * (set.reps_count || 1);
      if (set.distance_km) return total + set.distance_km;
      return total;
    }, 0);
  };

  const addSet = (exerciseId: string) => {
    const newSet: Set = {
      id: Date.now().toString(),
      exercise_id: exerciseId,
      reps_count: 0,
      weight: 0,
      weight_unit: user?.weightunit || "kg",
      user_id: user?.id || "",
      workout_id: "temp_" + Date.now().toString(),
    };
    setExerciseSets([...exerciseSets, newSet]);
  };

  const startIncrement = (
    setId: string,
    field: keyof Set,
    increment: number
  ) => {
    const updateValue = () => {
      updateSet(setId, (prev) => {
        const currentValue = Number(prev[field]) || 0;
        if (field === "time") {
          return { [field]: Math.max(0, currentValue + increment) };
        }
        if (field === "weight") {
          return { [field]: Math.max(0, currentValue + increment) };
        }
        return { [field]: Math.max(0, currentValue + increment) };
      });
    };

    updateValue();
    intervalRef.current = setInterval(updateValue, 100);
  };

  const stopIncrement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateSet = (
    setId: string,
    updates: Partial<Set> | ((prev: Set) => Partial<Set>)
  ) => {
    setExerciseSets(
      exerciseSets.map((set) =>
        set.id === setId
          ? {
              ...set,
              ...(typeof updates === "function" ? updates(set) : updates),
            }
          : set
      )
    );
  };

  const removeSet = (setId: string) => {
    setExerciseSets(exerciseSets.filter((set) => set.id !== setId));
  };

  const getEquipmentType = (equipment: string) => {
    const bodyweightEquipment = ["body weight", "assisted"];

    const timeEquipment = [
      "rope",
      "stationary bike",
      "elliptical machine",
      "upper body ergometer",
      "stepmill machine",
      "skierg machine",
    ];

    if (timeEquipment.includes(equipment)) {
      return "time";
    }
    if (bodyweightEquipment.includes(equipment)) {
      return "bodyweight";
    }
    return "weight";
  };

  const renderExerciseSets = (exercise: Exercise) => {
    const sets = exerciseSets.filter((set) => set.exercise_id === exercise.id);
    const equipmentType = getEquipmentType(exercise.equipment);

    return (
      <View
        key={exercise.id}
        className="mb-6 bg-white rounded-lg p-4 shadow-sm"
      >
        <View className="flex flex-row items-center justify-between mb-4">
          <View className="flex flex-row items-center justify-center">
            {exercise.image ? (
              <Image
                source={{ uri: exercise.image }}
                style={{
                  height: 150,
                  width: "70%",
                  borderRadius: 8,
                }}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View
                style={{
                  height: 150,
                  width: "50%",
                  backgroundColor: "#e5e7eb",
                  borderRadius: 8,
                }}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() => removeExercise(exercise.id)}
            className="p-2"
          >
            <AntDesign name="close" size={24} color="red" />
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-geist-semibold my-2 overflow-x-scroll">
          {exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}
        </Text>
        <Text className="text-sm text-gray-600 mb-2">
          <Text className="font-geist-semibold">Equipment:</Text>{" "}
          {exercise.equipment}
        </Text>

        {sets.map((set, index) => (
          <View key={set.id} className="mb-3 bg-gray-50 p-2 rounded-lg">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-geist-semibold text-sm">
                Set {index + 1}
              </Text>
              <Button
                text=""
                variant="secondary"
                onPress={() => removeSet(set.id)}
                className="max-w-16 h-12"
                Icon={{
                  Component: AntDesign,
                  name: "delete",
                  size: 14,
                  color: "red",
                  type: "expo",
                }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              {equipmentType !== "time" && (
                <View className="flex-row items-center">
                  <Text className="mr-2 text-sm">Reps</Text>
                  <TouchableOpacity
                    onPressIn={() => startIncrement(set.id, "reps_count", -1)}
                    onPressOut={stopIncrement}
                  >
                    <View className="w-7 h-7 items-center justify-center">
                      <AntDesign name="minus" size={16} color="black" />
                    </View>
                  </TouchableOpacity>
                  <TextInput
                    className="mx-1 w-10 text-center bg-white rounded border border-gray-200 text-sm"
                    keyboardType="numeric"
                    value={set.reps_count?.toString() || "0"}
                    onChangeText={(value) =>
                      updateSet(set.id, {
                        reps_count: parseInt(value, 10) || 0,
                      })
                    }
                  />
                  <TouchableOpacity
                    onPressIn={() => startIncrement(set.id, "reps_count", 1)}
                    onPressOut={stopIncrement}
                  >
                    <View className="w-7 h-7 items-center justify-center">
                      <AntDesign name="plus" size={16} color="black" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {equipmentType === "time" && (
                <View className="flex-row items-center">
                  <Text className="mr-2 text-sm">Time</Text>
                  <TouchableOpacity
                    onPressIn={() => startIncrement(set.id, "time", -30)}
                    onPressOut={stopIncrement}
                  >
                    <View className="w-7 h-7 items-center justify-center">
                      <AntDesign name="minus" size={16} color="black" />
                    </View>
                  </TouchableOpacity>
                  <TextInput
                    className="mx-1 w-24 text-center bg-white rounded border border-gray-200 text-sm"
                    keyboardType="numeric"
                    value={formatTime(set.time || 0)}
                    onChangeText={(value) => {
                      const totalSeconds = parseTimeInput(value);
                      updateSet(set.id, {
                        time: totalSeconds,
                      });
                    }}
                  />
                  <TouchableOpacity
                    onPressIn={() => startIncrement(set.id, "time", 30)}
                    onPressOut={stopIncrement}
                  >
                    <View className="w-7 h-7 items-center justify-center">
                      <AntDesign name="plus" size={16} color="black" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {equipmentType === "weight" && (
                <View className="flex-row items-center">
                  <Text className="mr-2 text-sm">
                    Weight ({user?.weightunit || "kg"})
                  </Text>
                  <TouchableOpacity
                    onPressIn={() => startIncrement(set.id, "weight", -2.5)}
                    onPressOut={stopIncrement}
                  >
                    <View className="w-7 h-7 items-center justify-center">
                      <AntDesign name="minus" size={16} color="black" />
                    </View>
                  </TouchableOpacity>
                  <TextInput
                    className="mx-1 w-12 text-center bg-white rounded border border-gray-200 text-sm"
                    keyboardType="numeric"
                    value={set.weight?.toString() || "0"}
                    onChangeText={(value) =>
                      updateSet(set.id, {
                        weight: parseFloat(value) || 0,
                      })
                    }
                  />
                  <TouchableOpacity
                    onPressIn={() => startIncrement(set.id, "weight", 2.5)}
                    onPressOut={stopIncrement}
                  >
                    <View className="w-7 h-7 items-center justify-center">
                      <AntDesign name="plus" size={16} color="black" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}

        <Button
          text="Add Set"
          variant="secondary"
          onPress={() => addSet(exercise.id)}
          className="mt-2"
          Icon={{
            Component: AntDesign,
            name: "plus",
            size: 16,
            color: "black",
            type: "expo",
          }}
        />
      </View>
    );
  };

  const handleFinishWorkout = async () => {
    if (exerciseSets.length === 0) {
      Alert.alert(
        "Cannot Finish Workout",
        "Please add at least one set to your workout before finishing."
      );
      return;
    }

    try {
      const { status } = await requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need permission to access your camera to take a workout photo."
        );
        return;
      }

      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        try {
          const photoUrl = await uploadWorkoutPhoto(result.assets[0].uri);
          await endWorkout(photoUrl);
        } catch (error) {
          console.error("Error uploading workout photo:", error);
          Alert.alert(
            "Error",
            "Failed to upload workout photo. Finishing workout without photo."
          );
          await endWorkout();
        }
      } else {
        await endWorkout();
      }
    } catch (error) {
      console.error("Error capturing workout photo:", error);
      await endWorkout();
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 bg-background items-start justify-start pt-24 px-8 gap-y-4 flex flex-col">
        <View className="flex items-center flex-row justify-between w-full">
          <Title variant="extra-large">Workout</Title>
          <Button
            text="Finish"
            variant="secondary"
            onPress={handleFinishWorkout}
            className="max-w-28 h-14"
            disabled={isLoading}
          />
        </View>
        <View className="mt-3 flex flex-row justify-between w-full">
          <View className="flex flex-col items-center">
            <Text className="text-secondary-600 text-sm">Duration</Text>
            <Text className="text-2xl text-primary-500 font-bold">
              {formatTime(elapsedTime)}
            </Text>
          </View>
          <View className="flex items-center mr-8">
            <Text className="text-secondary-600 text-sm">Volume</Text>
            <Text className="text-2xl text-primary-500 font-bold">
              {calculateTotalVolume()} kg
            </Text>
          </View>
          <View className="flex items-center mr-8">
            <Text className="text-secondary-600 text-sm">Sets</Text>
            <Text className="text-2xl text-primary-500 font-bold">
              {exerciseSets.length}
            </Text>
          </View>
        </View>

        {selectedExercises.length === 0 ? (
          <View className="flex flex-col items-center w-full mt-10">
            <Image
              source={require("@/client/assets/logo.png")}
              className="w-32 h-32"
            />
            <Text className="text-foreground text-xl font-bold">
              Get Started
            </Text>
            <Text className="text-secondary-400 text-md">
              Add an exercise to start your workout
            </Text>
          </View>
        ) : (
          <ScrollView className="w-full mt-4">
            {selectedExercises.map(renderExerciseSets)}
          </ScrollView>
        )}

        <View className="flex flex-col justify-center items-center w-full">
          <Button
            text="Add Exercise"
            onPress={() => navigation.navigate("Exercises")}
            variant="primary"
            className="mt-4 mb-8"
            Icon={{
              Component: AntDesign,
              name: "plus",
              size: 24,
              color: "white",
              type: "expo",
            }}
          />
          <Button
            text="Discard Workout"
            onPress={() => setDiscardDialogOpen(true)}
            variant="secondary"
            className="border border-red-300 mb-10"
            Icon={{
              Component: AntDesign,
              name: "close",
              size: 24,
              color: "black",
              type: "expo",
            }}
          />
        </View>
      </View>
      <DiscardWorkoutDialog
        open={discardDialogOpen}
        title="Discard Workout"
        description="Are you sure you want to discard this workout? All of your data will be permanently removed from our servers forever. This action cannot be undone."
        confirmText="Discard"
        setOpen={setDiscardDialogOpen}
        onConfirm={clearWorkout}
      />
    </ScrollView>
  );
};

export default Workout;
