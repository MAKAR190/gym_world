import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button, Title } from "@/client/components";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { auth } from "@/client/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkouts } from "@/server/services/workouts";

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isLoading } = auth.useSession();
  const { data: user_workouts } = useQuery({
    queryKey: ["user_workouts"],
    queryFn: () => fetchWorkouts(),
    enabled: !!user?.id,
  });

  return (
    <View className="min-h-screen bg-background flex flex-col items-center py-8">
      {user && !isLoading && (
        <>
          <View className="rounded-lg w-11/12 mt-10 max-w-md p-6 flex flex-col gap-4 items-center">
            <Image
              source={{ uri: user?.profile_picture }}
              alt="Profile"
              className="w-32 h-32 rounded-full border-2 border-blue-500"
            />
            <View className="flex flex-col gap-1 items-center">
              {user?.username && (
                <Title variant="extra-large">{user?.username}</Title>
              )}
              <Text className="text-gray-500">{user?.bio}</Text>
            </View>
            <View className="mt-3 flex flex-row justify-between w-full">
              <View className="flex items-center">
                <Text className="text-3xl font-bold">
                  {user_workouts?.length || 0}
                </Text>
                <Text className="text-gray-600 text-sm">Workouts</Text>
              </View>
              <View className="flex items-center ml-3">
                <Text className="text-3xl font-bold">{user?.tokens || 0}</Text>
                <Text className="text-gray-600 text-sm">Tokens</Text>
              </View>
              <View className="flex items-center">
                <Text className="text-3xl font-bold">
                  {user?.created_at
                    ? Math.floor(
                        (Date.now() - new Date(user?.created_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0}
                </Text>
                <Text className="text-gray-600 text-sm">Days Active</Text>
              </View>
            </View>
            <Button
              onPress={() => navigation.navigate("EditProfile")}
              text="Edit Profile"
              className="rounded-2xl mt-2"
            />
          </View>

          <View className="bg-white rounded-lg w-11/12 max-w-md mt-14 p-4 flex flex-col gap-10">
            <TouchableOpacity className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-center gap-2">
                <MaterialCommunityIcons name="medal" size={30} color="black" />
                <Text className="text-2xl font-bold">Achievements</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-center gap-2">
                <MaterialCommunityIcons
                  name="history"
                  size={30}
                  color="black"
                />
                <Text className="text-2xl font-bold">Workout History</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-center gap-2">
                <MaterialCommunityIcons
                  name="chart-box"
                  size={30}
                  color="black"
                />
                <Text className="text-2xl font-bold">Statistics</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Profile;
