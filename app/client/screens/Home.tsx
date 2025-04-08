import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { PullToRefresh } from "../components/PullToRefresh";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Screen1 = () => {
  return (
    <View className="flex-1 justify-center items-center bg-red-500">
      <Text className="text-2xl">Home Screen 1</Text>
    </View>
  );
};

const Screen2 = () => {
  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <Text className="text-2xl">Home Screen 2</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "screen1", title: "Screen 1" },
    { key: "screen2", title: "Screen 2" },
  ]);

  const handleRefresh = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const renderScene = SceneMap({
    screen1: Screen1,
    screen2: Screen2,
  });

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullThreshold={40}
      maxPullDistance={40}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        swipeEnabled
        renderTabBar={() => null}
      />
    </PullToRefresh>
  );
};

export default HomeScreen;
