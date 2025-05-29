import React, { useMemo } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  fetchWorkouts,
  fetchWorkoutWithDetails,
} from "@/server/services/workouts";
import { Workout, Exercise, Set } from "@/types/DatabaseModels";
import { auth } from "@/client/hooks";
import ConnectGoogleFit from "@/client/components/Trackers/FitTracker";

interface WorkoutWithDetails extends Workout {
  exercises?: Array<{
    exercise: Exercise;
    sets: Set[];
  }>;
}

const WorkoutStats = () => {
  const screenWidth = Dimensions.get("window").width;
  const { user } = auth.useSession();

  const { data: workouts } = useQuery({
    queryKey: ["user_workouts"],
    queryFn: () => fetchWorkouts(),
    enabled: !!user?.id,
  });

  const { data: workoutsWithDetails } = useQuery({
    queryKey: ["user_workouts_details", workouts],
    queryFn: async () => {
      if (!workouts) return [];
      return Promise.all(
        workouts.map((workout) => fetchWorkoutWithDetails(workout))
      );
    },
    enabled: !!workouts,
  });

  const stats = useMemo(() => {
    if (!workoutsWithDetails)
      return {
        totalWorkouts: 0,
        averageDuration: 0,
        mostFrequentExercises: [],
        weightProgression: [],
        intensityData: [],
      };

    console.log("Workouts with details:", workoutsWithDetails);
    const totalWorkouts = workoutsWithDetails.length;
    console.log("Total workouts:", totalWorkouts);

    const totalDuration = workoutsWithDetails.reduce(
      (sum: number, workout: WorkoutWithDetails) => {
        const [minutes, seconds] = workout.duration.split(":").map(Number);
        return sum + minutes + seconds / 60;
      },
      0
    );
    const averageDuration =
      totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    console.log("Average duration:", averageDuration);

    const exerciseFrequency = workoutsWithDetails.reduce(
      (acc: Record<string, number>, workout: WorkoutWithDetails) => {
        workout.exercises?.forEach(({ exercise }) => {
          acc[exercise.name] = (acc[exercise.name] || 0) + 1;
        });
        return acc;
      },
      {}
    );
    console.log("Exercise frequency:", exerciseFrequency);

    const mostFrequentExercises = Object.entries(exerciseFrequency)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5);
    console.log("Most frequent exercises:", mostFrequentExercises);

    const weightProgression = workoutsWithDetails
      .flatMap(
        (workout: WorkoutWithDetails) =>
          workout.exercises?.flatMap(({ exercise, sets }) =>
            sets
              .filter((set: Set) => set.weight)
              .map((set: Set) => ({
                date: new Date(workout.created_at),
                weight: set.weight || 0,
                exercise: exercise.name,
              }))
          ) || []
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    console.log("Weight progression:", weightProgression);

    const intensityData = workoutsWithDetails.map(
      (workout: WorkoutWithDetails) => ({
        date: new Date(workout.created_at),
        volume: workout.volume || 0,
      })
    );
    console.log("Intensity data:", intensityData);

    return {
      totalWorkouts,
      averageDuration,
      mostFrequentExercises,
      weightProgression,
      intensityData,
    };
  }, [workoutsWithDetails]);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    formatYLabel: (value: string) => {
      try {
        const num = parseFloat(value);
        return isNaN(num) ? "0" : Math.round(num).toString();
      } catch {
        return "0";
      }
    },
    formatXLabel: (value: string) => value,
    propsForLabels: {
      fontSize: 12,
    },
  };

  if (!workoutsWithDetails) {
    return null;
  }

  if (workoutsWithDetails.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          padding: 16,
          marginTop: 26,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Workout Statistics
        </Text>
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>
            No workouts recorded yet. Start tracking your workouts to see your
            statistics!
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <ConnectGoogleFit />
        </View>
      </View>
    );
  }

  // Prepare chart data
  const barChartData = {
    labels: stats.mostFrequentExercises.map(([name]) => name),
    datasets: [
      {
        data: stats.mostFrequentExercises.map(
          ([, count]) => Number(count) || 0
        ),
      },
    ],
  };

  const weightChartData = {
    labels: stats.weightProgression.map((item) => format(item.date, "MM/dd")),
    datasets: [
      {
        data: stats.weightProgression.map((item) => Number(item.weight) || 0),
      },
    ],
  };

  const intensityChartData = {
    labels: stats.intensityData.map((item) => format(item.date, "MM/dd")),
    datasets: [
      {
        data: stats.intensityData.map((item) => Number(item.volume) || 0),
      },
    ],
  };

  console.log("Chart data:", {
    barChart: barChartData,
    weightChart: weightChartData,
    intensityChart: intensityChartData,
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 16, marginTop: 26 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Workout Statistics
        </Text>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Summary
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#666" }}>
                Total Workouts
              </Text>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {stats.totalWorkouts}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#666" }}>Avg Duration</Text>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {stats.averageDuration.toFixed(1)} min
              </Text>
            </View>
          </View>
        </View>

        {stats.mostFrequentExercises.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              Most Frequent Exercises
            </Text>
            <BarChart
              data={barChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              style={{ marginVertical: 8, borderRadius: 16 }}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
            />
          </View>
        )}

        {stats.weightProgression.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              Weight Progression
            </Text>
            <LineChart
              data={weightChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              style={{ marginVertical: 8, borderRadius: 16 }}
              yAxisLabel=""
              yAxisSuffix=" kg"
              fromZero
            />
          </View>
        )}

        {stats.intensityData.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              Workout Intensity
            </Text>
            <LineChart
              data={intensityChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              style={{ marginVertical: 8, borderRadius: 16 }}
              yAxisLabel=""
              yAxisSuffix=" kg"
              fromZero
            />
          </View>
        )}
      </View>
      <View style={{ marginBottom: 56 }}>
        <ConnectGoogleFit />
      </View>
    </ScrollView>
  );
};

export default WorkoutStats;
