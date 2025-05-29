import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import {
  fetchWorkouts,
  fetchWorkoutWithDetails,
} from "@/server/services/workouts";
import { Workout, Exercise, Set } from "@/types/DatabaseModels";
import { format } from "date-fns";
import { Image } from "expo-image";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface WorkoutWithDetails extends Workout {
  exercises?: Array<{
    exercise: Exercise;
    sets: Set[];
  }>;
}

const formatDuration = (duration: string): string => {
  const [minutes, seconds] = duration.split(":").map(Number);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};

const WorkoutDetails = ({ workout }: { workout: WorkoutWithDetails }) => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
        Workout Details
      </Text>
      <Text style={{ color: "white", fontSize: 16 }}>
        Duration: {formatDuration(workout.duration)}
      </Text>
      <Text style={{ color: "white", fontSize: 16 }}>
        Volume: {workout.volume} kg
      </Text>
      <Text style={{ color: "white", fontSize: 16 }}>Sets: {workout.sets}</Text>
      <Text style={{ color: "white", fontSize: 16 }}>
        Date: {format(new Date(workout.created_at), "MMM dd, yyyy")}
      </Text>
    </View>
  );
};

const WorkoutExercises = ({ workout }: { workout: WorkoutWithDetails }) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      nestedScrollEnabled
    >
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 16,
        }}
      >
        Exercises
      </Text>
      {workout.exercises?.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            {item.exercise.name}
          </Text>
          <Text style={{ color: "white", fontSize: 14, marginBottom: 8 }}>
            Target: {item.exercise.target}
          </Text>
          <Text style={{ color: "white", fontSize: 14, marginBottom: 8 }}>
            Equipment: {item.exercise.equipment}
          </Text>
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Sets
            </Text>
            {item.sets.map((set, setIndex) => (
              <View
                key={setIndex}
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>
                  Weight: {set.weight} kg
                </Text>
                <Text style={{ color: "white", fontSize: 14 }}>
                  Reps: {set.reps_count}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const WorkoutPhoto = ({ workout }: { workout: WorkoutWithDetails }) => {
  if (!workout.photo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "600" }}>
          No Photo Available
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: workout.photo }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
    </View>
  );
};

const WorkoutTabView = ({ workout }: { workout: WorkoutWithDetails }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "photo", title: "Photo" },
    { key: "details", title: "Details" },
    { key: "exercises", title: "Exercises" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "details":
        return <WorkoutDetails workout={workout} />;
      case "exercises":
        return <WorkoutExercises workout={workout} />;
      case "photo":
        return <WorkoutPhoto workout={workout} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ height: 300, position: "relative" }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          position: "absolute",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        style={{ flex: 1 }}
        renderTabBar={() => null}
      />
    </View>
  );
};

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const fetchedWorkouts = await fetchWorkouts();
        if (fetchedWorkouts) {
          const workoutsWithDetails = await Promise.all(
            fetchedWorkouts.map((workout) => fetchWorkoutWithDetails(workout))
          );
          const sortedWorkouts = workoutsWithDetails.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          setWorkouts(sortedWorkouts);
        }
      } catch (error) {
        console.error("Error loading workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading workouts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white", paddingVertical: 24 }}>
      <View style={{ paddingHorizontal: 16, maxWidth: 900 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "600",
            color: "#1a202c",
            marginBottom: 8,
            marginTop: 40,
          }}
        >
          Workout History
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: "#718096" }}>
          View your workout history here.
        </Text>

        <View style={{ marginTop: 32 }}>
          {workouts.map((workout) => (
            <View
              key={workout.id}
              style={{
                marginBottom: 20,
                borderRadius: 16,
                backgroundColor: "#edf2f7",
                elevation: 1,
                overflow: "hidden",
              }}
            >
              <WorkoutTabView workout={workout} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
