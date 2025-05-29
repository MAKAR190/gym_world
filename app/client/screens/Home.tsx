import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabView } from "react-native-tab-view";
import {
  fetchAllWorkouts,
  toggleWorkoutLike,
  fetchWorkoutWithDetails,
} from "@/server/services/workouts";
import { Workout, Exercise, Set } from "@/types/DatabaseModels";
import { getCurrentUser } from "@/server/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constants";

const SCREEN_WIDTH = Dimensions.get("window").width;

type RootStackParamList = {
  Comments: { workoutId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WorkoutWithUser extends Workout {
  user: {
    id: string;
    username: string;
    profile_picture: string | null;
  };
}

interface WorkoutWithDetails extends Workout {
  exercises?: Array<{
    exercise: Exercise;
    sets: Set[];
  }>;
  user?: {
    id: string;
    username: string;
    profile_picture: string | null;
  };
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

const PostHeader = ({ workout }: { workout: WorkoutWithDetails }) => {
  return (
    <View className="flex-row items-center p-4 border-b border-gray-200">
      <Image
        source={
          workout.user?.profile_picture
            ? { uri: workout.user.profile_picture }
            : (DEFAULT_PROFILE_PICTURE as ImageSourcePropType)
        }
        className="w-10 h-10 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="font-semibold">
          {workout.user?.username || "Anonymous"}
        </Text>
        <Text className="text-gray-500 text-sm">
          {format(new Date(workout.created_at), "MMM dd, yyyy")}
        </Text>
      </View>
    </View>
  );
};

const WorkoutDetails = ({
  workout,
  onLike,
}: {
  workout: WorkoutWithDetails;
  onLike: () => void;
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(workout.likes?.length || 0);

  const checkIfLiked = useCallback(async () => {
    const { user } = await getCurrentUser();
    if (user && workout.likes) {
      setIsLiked(workout.likes.includes(user.id));
    }
  }, [workout.likes]);

  useEffect(() => {
    checkIfLiked();
  }, [checkIfLiked]);

  const handleLike = async () => {
    await onLike();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleCommentsPress = () => {
    navigation.navigate("Comments", { workoutId: workout.id });
  };

  return (
    <View className="flex-1">
      {workout.photo && (
        <Image
          source={{ uri: workout.photo }}
          className="w-full h-64"
          resizeMode="cover"
        />
      )}
      <View className="p-4">
        <Text className="text-lg font-bold">Workout Details</Text>
        <Text className="text-gray-600">
          Duration: {formatDuration(workout.duration)}
        </Text>
        <Text className="text-gray-600">Volume: {workout.volume} kg</Text>
        <Text className="text-gray-600">Sets: {workout.sets}</Text>

        <View className="flex-row items-center mt-4">
          <TouchableOpacity
            onPress={handleLike}
            className="flex-row items-center mr-6"
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "red" : "black"}
            />
            <Text className="ml-1">{likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCommentsPress}
            className="flex-row items-center"
          >
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text className="ml-1">Comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const WorkoutExercises = ({ workout }: { workout: WorkoutWithDetails }) => {
  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4">
      {workout.exercises?.map((item, index) => (
        <View key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">
            {item.exercise.name}
          </Text>
          <Text className="text-gray-600 mb-2">
            Target: {item.exercise.target}
          </Text>
          <Text className="text-gray-600 mb-2">
            Equipment: {item.exercise.equipment}
          </Text>
          <View className="mt-2">
            <Text className="text-base font-semibold mb-2">Sets</Text>
            {item.sets.map((set, setIndex) => (
              <View key={setIndex} className="bg-white p-2 rounded mb-2">
                <Text className="text-gray-600">Weight: {set.weight} kg</Text>
                <Text className="text-gray-600">Reps: {set.reps_count}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const WorkoutPost = ({
  workout,
  onLike,
}: {
  workout: WorkoutWithDetails;
  onLike: () => void;
}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "details", title: "Details" },
    { key: "exercises", title: "Exercises" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "details":
        return <WorkoutDetails workout={workout} onLike={onLike} />;
      case "exercises":
        return <WorkoutExercises workout={workout} />;
      default:
        return null;
    }
  };

  return (
    <View className="bg-white mb-4 rounded-lg shadow-sm">
      <PostHeader workout={workout} />
      <View style={{ height: 400 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={() => null}
          initialLayout={{ width: SCREEN_WIDTH, height: 400 }}
        />
      </View>
    </View>
  );
};

const WorkoutPostSkeleton = () => {
  return (
    <View className="bg-white mb-4 rounded-lg shadow-sm">
      {/* Header skeleton */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
        <View className="flex-1">
          <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <View className="h-3 w-32 bg-gray-200 rounded" />
        </View>
      </View>

      {/* Content skeleton */}
      <View className="p-4">
        <View className="h-48 w-full bg-gray-200 rounded-lg mb-4" />
        <View className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <View className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <View className="h-4 w-20 bg-gray-200 rounded mb-4" />

        {/* Actions skeleton */}
        <View className="flex-row items-center">
          <View className="h-6 w-16 bg-gray-200 rounded mr-6" />
          <View className="h-6 w-20 bg-gray-200 rounded" />
        </View>
      </View>
    </View>
  );
};

const Home = () => {
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkouts = async () => {
    try {
      setRefreshing(true);
      const fetchedWorkouts = await fetchAllWorkouts();
      if (fetchedWorkouts) {
        const workoutsWithDetails = await Promise.all(
          (fetchedWorkouts as WorkoutWithUser[]).map(async (workout) => {
            const details = await fetchWorkoutWithDetails(workout);
            return {
              ...details,
              user: workout.user,
            };
          })
        );
        setWorkouts(workoutsWithDetails);
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleLike = async (workoutId: string) => {
    try {
      await toggleWorkoutLike(workoutId);
      const { user } = await getCurrentUser();
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) => {
          if (workout.id === workoutId) {
            const isLiked = workout.likes?.includes(user?.id || "");
            const updatedLikes = isLiked
              ? workout.likes?.filter((id) => id !== user?.id) || []
              : [...(workout.likes || []), user?.id || ""];
            return {
              ...workout,
              likes: updatedLikes,
            };
          }
          return workout;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background p-4 pt-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <WorkoutPostSkeleton key={index} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={
          refreshing
            ? Array.from({ length: 3 }).map((_, i) => ({
                id: `skeleton-${i}`,
              }))
            : workouts
        }
        renderItem={({ item }) =>
          refreshing ? (
            <WorkoutPostSkeleton />
          ) : (
            <WorkoutPost
              workout={item as WorkoutWithDetails}
              onLike={() => handleLike(item.id)}
            />
          )
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
        scrollEnabled={true}
        nestedScrollEnabled={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={5}
        refreshing={refreshing}
        onRefresh={loadWorkouts}
      />
    </View>
  );
};

export default Home;
