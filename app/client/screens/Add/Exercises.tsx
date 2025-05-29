import { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { MaterialIcons } from "@expo/vector-icons";
import { Title, Button, ExerciseList } from "@/client/components";
import { AntDesign } from "@expo/vector-icons";
import { Input } from "@/client/components/Input";
import { useQuery } from "@tanstack/react-query";
import { fetchExercises, searchExercises } from "@/server/services/exercises";
import { Exercise } from "@/types/DatabaseModels";
import { PaginatedResponse } from "@/types/AppModels";
import { useDebounce } from "@/client/hooks";
import { useWorkout } from "@/client/contexts/WorkoutContext";

const Exercises = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(
    new Set()
  );
  const debouncedSearch = useDebounce(search, 500);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    addExercise,
    isWorkoutActive,
    selectedExercises: workoutExercises,
  } = useWorkout();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!isWorkoutActive) {
      navigation.navigate("Tabs", { screen: "Add" });
    }
  }, [isWorkoutActive, navigation]);

  useEffect(() => {
    const initialSelected = new Set(workoutExercises.map((ex) => ex.id));
    setSelectedExercises(initialSelected);
  }, [workoutExercises]);

  const { data: exercises, isLoading } = useQuery<PaginatedResponse<Exercise>>({
    queryKey: ["exercises", page, debouncedSearch],
    queryFn: () =>
      debouncedSearch
        ? searchExercises({ query: debouncedSearch, page, pageSize: 10 })
        : fetchExercises({ page, pageSize: 10 }),
  });

  useEffect(() => {
    if (!exercises) return;

    if (page === 1) {
      setAllExercises((prev) => {
        const selectedExercisesToKeep = prev.filter((ex) =>
          selectedExercises.has(ex.id)
        );
        const newSearchResults = exercises.data.filter(
          (ex) => !selectedExercises.has(ex.id)
        );
        return [...selectedExercisesToKeep, ...newSearchResults];
      });
    } else {
      setAllExercises((prev) => {
        const newExercises = exercises.data.filter(
          (ex) => !prev.some((pe) => pe.id === ex.id)
        );
        return [...prev, ...newExercises];
      });
    }
  }, [exercises, page, selectedExercises]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && exercises?.hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, exercises?.hasMore]);

  const handleToggleExercise = useCallback((id: string) => {
    setSelectedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleAddSelectedExercises = useCallback(() => {
    const exercisesToAdd = allExercises.filter(
      (exercise) =>
        selectedExercises.has(exercise.id) &&
        !workoutExercises.some((we) => we.id === exercise.id)
    );

    exercisesToAdd.forEach((exercise) => addExercise(exercise));

    setSelectedExercises(new Set());
    navigation.goBack();
  }, [
    allExercises,
    selectedExercises,
    workoutExercises,
    addExercise,
    navigation,
  ]);

  const paginatedData: PaginatedResponse<Exercise> = {
    data: allExercises,
    total: exercises?.total || 0,
    page: exercises?.page || 1,
    pageSize: exercises?.pageSize || 10,
    hasMore: exercises?.hasMore || false,
  };

  return (
    <View className="flex-1 bg-background items-start justify-start pt-24 flex flex-col">
      <View className="px-8 gap-y-4">
        <MaterialIcons
          name="arrow-back-ios"
          size={24}
          style={{ marginTop: 16 }}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <View className="flex flex-row items-center justify-between w-full">
          <Title variant="extra-large">Exercises</Title>
          <Button
            Icon={{
              Component: AntDesign,
              name: "plus",
              size: 24,
              color: "black",
              type: "expo",
            }}
            onPress={handleAddSelectedExercises}
            variant="secondary"
            className="max-w-20 h-18"
            disabled={selectedExercises.size === 0}
          />
        </View>
        <Input
          id="search-input"
          placeholder="Search exercises..."
          value={search}
          inputMode="search"
          onChange={setSearch}
          type="text"
          saveErrorSpace={false}
        />
      </View>
      <ExerciseList
        exercises={paginatedData}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        selectedExercises={selectedExercises}
        onToggleExercise={handleToggleExercise}
      />
    </View>
  );
};

export default Exercises;
