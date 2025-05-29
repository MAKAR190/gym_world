import { Exercise } from "@/types/DatabaseModels";
import { View, Text, FlatList, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Checkbox } from "@/client/components/Checkbox";
import { useState, useCallback, memo } from "react";
import { PaginatedResponse } from "@/types/AppModels";

const Tag = memo(
  ({
    value,
    type,
  }: {
    value: string;
    type: "equipment" | "body" | "target" | "secondary";
  }) => {
    const getTagStyle = () => {
      switch (type) {
        case "equipment":
          return "bg-blue-100";
        case "body":
          return "bg-green-100";
        case "target":
          return "bg-purple-100";
        case "secondary":
          return "bg-orange-100";
        default:
          return "bg-gray-100";
      }
    };

    return (
      <View className={`${getTagStyle()} px-2 py-0.5 rounded-full mr-2`}>
        <Text className="text-xs text-gray-700 font-geist-normal">{value}</Text>
      </View>
    );
  }
);

const SkeletonExercise = memo(() => {
  return (
    <View className="bg-background rounded-2xl p-4 mb-4 shadow-lg flex-row w-full">
      <View className="mr-3 justify-center">
        <View className="h-4 w-4 rounded-sm bg-gray-200" />
      </View>
      <View className="w-[50%] mr-4">
        <View className="h-[120px] w-full rounded-lg bg-gray-200" />
      </View>
      <View className="flex-1">
        <View className="h-6 w-3/4 bg-gray-200 rounded-md mb-2" />
        <View className="flex-row mb-2">
          <View className="h-5 w-20 bg-gray-200 rounded-full mr-2" />
          <View className="h-5 w-20 bg-gray-200 rounded-full mr-2" />
          <View className="h-5 w-20 bg-gray-200 rounded-full" />
        </View>
        <View className="h-[100px]">
          <View className="h-4 w-full bg-gray-200 rounded-md mb-2" />
          <View className="h-4 w-5/6 bg-gray-200 rounded-md mb-2" />
          <View className="h-4 w-4/6 bg-gray-200 rounded-md" />
        </View>
      </View>
    </View>
  );
});

const ExerciseItem = memo(
  ({
    item,
    isSelected,
    onToggle,
  }: {
    item: Exercise;
    isSelected: boolean;
    onToggle: (id: string) => void;
  }) => {
    const [imageLoading, setImageLoading] = useState(true);

    return (
      <View className="bg-background rounded-2xl p-4 mb-4 shadow-lg flex-row w-full">
        <View className="mr-3 justify-center">
          <Checkbox
            label=""
            checked={isSelected}
            onChange={() => onToggle(item.id)}
          />
        </View>
        {item.image && (
          <View className="w-[50%] mr-4">
            {imageLoading && (
              <View className="h-[120px] w-full rounded-lg bg-gray-200 absolute" />
            )}
            <Image
              source={item.image}
              style={{ height: 120, width: "100%", borderRadius: 8 }}
              contentFit="scale-down"
              onLoadEnd={() => setImageLoading(false)}
            />
          </View>
        )}
        <View className="flex-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <Text className="text-md font-semibold text-foreground font-geist-semibold">
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <View className="flex-row">
              <Tag value={item.equipment} type="equipment" />
              {item.body_part && <Tag value={item.body_part} type="body" />}
              {item.target && <Tag value={item.target} type="target" />}
              {item.secondary_muscles && (
                <Tag value={item.secondary_muscles} type="secondary" />
              )}
            </View>
          </ScrollView>
          {item.instructions && (
            <View className="h-[100px]">
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <Text className="text-xs text-gray-600 font-geist-normal">
                  {item.instructions}
                </Text>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  }
);

const ExerciseList = ({
  exercises,
  onLoadMore,
  isLoading,
  selectedExercises,
  onToggleExercise,
}: {
  exercises: PaginatedResponse<Exercise>;
  onLoadMore: () => void;
  isLoading: boolean;
  selectedExercises: Set<string>;
  onToggleExercise: (id: string) => void;
}) => {
  const selectedExercisesList = exercises.data.filter((ex) =>
    selectedExercises.has(ex.id)
  );
  const unselectedExercisesList = exercises.data.filter(
    (ex) => !selectedExercises.has(ex.id)
  );

  const sortedExercises = [
    ...selectedExercisesList,
    ...unselectedExercisesList,
  ];

  const renderExercise = useCallback(
    ({ item }: { item: Exercise }) => {
      return (
        <ExerciseItem
          item={item}
          isSelected={selectedExercises.has(item.id)}
          onToggle={onToggleExercise}
        />
      );
    },
    [selectedExercises, onToggleExercise]
  );

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return (
      <View className="py-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <SkeletonExercise key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }, [isLoading]);

  if (isLoading && exercises.data.length === 0) {
    return (
      <View className="flex-1 w-full px-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonExercise key={index} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 w-full">
      <FlatList
        data={sortedExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExercise}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, width: "100%" }}
        style={{ width: "100%" }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        onEndReached={exercises.hasMore ? onLoadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default ExerciseList;
