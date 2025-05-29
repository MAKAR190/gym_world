import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Exercise, Set } from "@/types/DatabaseModels";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import {
  createWorkout,
  createExerciseWorkout,
  createSets,
} from "@/server/services/workouts";
import { useQueryClient } from "@tanstack/react-query";
import { rewardWorkout } from "@/server/services/tokens";
import { getCurrentUser } from "@/server/services/auth";
import { useWallet } from "./WalletContext";
import { supabase } from "@/lib/supabase";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

// Define the background task name
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND_NOTIFICATION_TASK";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Define the background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    const { user } = await getCurrentUser();
    if (!user) return BackgroundFetch.BackgroundFetchResult.NoData;

    const { data: userData } = await supabase
      .from("users")
      .select("notifications")
      .eq("id", user.id)
      .single();

    if (!userData?.notifications)
      return BackgroundFetch.BackgroundFetchResult.NoData;

    // Check if it's 9 AM
    const now = new Date();
    if (now.getHours() === 9 && now.getMinutes() === 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to Work Out! 💪",
          body: "Don't forget your daily workout. Your fitness journey continues!",
          data: { type: "workout_reminder" },
        },
        trigger: null,
      });
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const registerBackgroundTask = async () => {
  try {
    // Check if the task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_NOTIFICATION_TASK
    );
    if (isRegistered) return;

    // Register the background task
    await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
      minimumInterval: 60 * 15, // Run every 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });

    // Set the background fetch status
    await BackgroundFetch.setMinimumIntervalAsync(60 * 15);
  } catch (error) {
    console.error("Error registering background task:", error);
  }
};

interface WorkoutContextType {
  isWorkoutActive: boolean;
  selectedExercises: Exercise[];
  startTime: number | null;
  elapsedTime: number;
  exerciseSets: Set[];
  isLoading: boolean;
  startWorkout: () => void;
  endWorkout: (photoUrl?: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;
  clearWorkout: () => void;
  setExerciseSets: (sets: Set[]) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseSets, setExerciseSets] = useState<Set[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshBalance } = useWallet();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, startTime]);

  useEffect(() => {
    // Register the background task when the app starts
    registerBackgroundTask();
  }, []);

  const clearWorkout = useCallback(() => {
    setIsWorkoutActive(false);
    setStartTime(null);
    setElapsedTime(0);
    setSelectedExercises([]);
    setExerciseSets([]);
    navigation.navigate("Tabs", { screen: "Add" });
  }, [navigation]);

  const endWorkout = useCallback(
    async (photoUrl?: string) => {
      try {
        setIsLoading(true);
        navigation.navigate("Loading");

        const { user } = await getCurrentUser();
        if (!user) {
          throw new Error("User not found");
        }

        const totalVolume = exerciseSets.reduce(
          (sum, set) => sum + (set.weight || 0),
          0
        );

        const workout = await createWorkout(
          `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60)
            .toString()
            .padStart(2, "0")}`,
          totalVolume,
          exerciseSets.length,
          photoUrl
        );

        if (!workout) {
          throw new Error("Failed to create workout");
        }

        const setsToCreate = exerciseSets.map(
          ({
            exercise_id,
            reps_count,
            time,
            weight,
            weight_unit,
            distance_km,
          }) => ({
            exercise_id,
            reps_count,
            time,
            weight,
            weight_unit,
            distance_km,
            user_id: user.id,
            workout_id: workout.id,
          })
        );
        await createSets(setsToCreate, workout.id);

        for (const exercise of selectedExercises) {
          await createExerciseWorkout(exercise.id, workout.id);
        }

        await rewardWorkout({
          reps:
            Math.round(
              exerciseSets.reduce((sum, set) => sum + (set.reps_count || 0), 0)
            ) || 0,
          weight: Math.round(totalVolume) || 0,
          time: Math.round(elapsedTime) || 0,
          distance:
            Math.round(
              exerciseSets.reduce((sum, set) => sum + (set.distance_km || 0), 0)
            ) || 0,
        });
        await refreshBalance();

        // Send workout completion notification
        const { data: userData } = await supabase
          .from("users")
          .select("notifications")
          .eq("id", user.id)
          .single();

        if (userData?.notifications) {
          try {
            // Check and request notification permissions if needed
            const { status: existingStatus } =
              await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }

            if (finalStatus === "granted") {
              // Schedule a local notification
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Workout Complete! 🎉",
                  body: "Great job completing your workout! Keep up the good work!",
                  data: { type: "workout_complete" },
                },
                trigger: null, // Show immediately
              });
            }
          } catch (error) {
            console.error("Error handling notifications:", error);
          }
        }

        queryClient.invalidateQueries({ queryKey: ["workouts"] });
        queryClient.invalidateQueries({ queryKey: ["user_workouts"] });
        clearWorkout();
        navigation.navigate("Tabs", { screen: "Profile" });
      } catch (error) {
        console.error("Error ending workout:", error);
        navigation.navigate("Tabs", { screen: "Add" });
      } finally {
        setIsLoading(false);
      }
    },
    [
      navigation,
      exerciseSets,
      elapsedTime,
      selectedExercises,
      clearWorkout,
      queryClient,
      refreshBalance,
    ]
  );

  const startWorkout = useCallback(() => {
    setIsWorkoutActive(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, []);

  const addExercise = useCallback((exercise: Exercise) => {
    setSelectedExercises((prev) => {
      if (prev.some((e) => e.id === exercise.id)) return prev;
      return [...prev, exercise];
    });
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setSelectedExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    setExerciseSets((prev) =>
      prev.filter((set) => set.exercise_id !== exerciseId)
    );
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        isWorkoutActive,
        selectedExercises,
        startTime,
        elapsedTime,
        exerciseSets,
        isLoading,
        startWorkout,
        endWorkout,
        addExercise,
        removeExercise,
        clearWorkout,
        setExerciseSets,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
