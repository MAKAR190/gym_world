import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Button, Title } from "@/client/components";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { auth } from "@/client/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkouts } from "@/server/services/workouts";
import { TabView } from "react-native-tab-view";
import { User } from "@supabase/auth-js";
import { Workout } from "@/types/DatabaseModels";
import { useWallet } from "@/client/contexts/WalletContext";
import GwcLogo from "@/client/assets/gwc.svg";

interface ProfileSceneProps {
  user: User | null | undefined;
  isLoading: boolean;
  user_workouts: Workout[] | null | undefined;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const ProfileScene = ({
  user,
  isLoading,
  user_workouts,
  navigation,
}: ProfileSceneProps) => (
  <View className="min-h-screen bg-background flex flex-col items-center py-8">
    {user && !isLoading && (
      <>
        <View className="rounded-lg w-11/12 mt-10 max-w-md p-6 flex flex-col gap-4 items-center">
          <Image
            source={{ uri: user?.profile_picture }}
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-blue-500"
            onError={(e) =>
              console.log("Image loading error:", e.nativeEvent.error)
            }
          />
          <View className="flex flex-col gap-1 items-center">
            {user?.username && (
              <Title variant="extra-large">{user?.username}</Title>
            )}
            <Text className="text-gray-500">{user?.bio}</Text>
          </View>
          <View className="mt-3 flex flex-row justify-center gap-10 w-full">
            <View className="flex items-center">
              <Text className="text-3xl font-bold">
                {user_workouts?.length || 0}
              </Text>
              <Text className="text-gray-600 text-sm">Workouts</Text>
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
          <TouchableOpacity
            onPress={() => navigation.navigate("WorkoutHistory")}
            className="flex flex-row items-center justify-between"
          >
            <View className="flex flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="history" size={30} color="black" />
              <Text className="text-2xl font-bold">Workout History</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("WorkoutStats")}
            className="flex flex-row items-center justify-between"
          >
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

const WalletScene = () => {
  const {
    walletAddress,
    tokenBalance,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  return (
    <ScrollView className="min-h-screen bg-background p-4">
      <View className="bg-white rounded-lg p-6 mb-4">
        <Title variant="large" className="mb-4">
          Wallet
        </Title>

        {!walletAddress ? (
          <Button
            onPress={connectWallet}
            text={isConnecting ? "Connecting..." : "Connect Wallet"}
            className="rounded-2xl"
          />
        ) : (
          <View className="space-y-4">
            <View className="bg-gray-100 p-4 rounded-lg">
              <Text className="text-gray-600 text-sm">Wallet Address</Text>
              <Text className="font-mono text-sm break-all">
                {walletAddress}
              </Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-lg">
              <Text className="text-gray-600 text-sm">Token Balance</Text>
              <View className="flex flex-row items-center mb-10">
                <Text className="text-2xl font-bold">
                  {Number(tokenBalance) * 10 ** 18} GWC
                </Text>
                <GwcLogo width={32} height={32} style={{ marginLeft: 8 }} />
              </View>
              <Button
                onPress={disconnectWallet}
                text="Disconnect Wallet"
                className="rounded-2xl"
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

interface Route {
  key: string;
  title: string;
}

const Profile = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: "profile", title: "Profile" },
    { key: "wallet", title: "Wallet" },
  ]);

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isLoading } = auth.useSession();
  const { data: user_workouts } = useQuery({
    queryKey: ["user_workouts"],
    queryFn: () => fetchWorkouts(),
    enabled: !!user?.id,
  });

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case "profile":
        return (
          <ProfileScene
            user={user}
            isLoading={isLoading}
            user_workouts={user_workouts}
            navigation={navigation}
          />
        );
      case "wallet":
        return <WalletScene />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      style={{ flex: 1 }}
      renderTabBar={() => null}
    />
  );
};

export default Profile;
