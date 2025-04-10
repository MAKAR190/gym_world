import { Pressable, Vibration } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Explore, Add, Marketplace, Profile } from "@/client/screens";
import {
  TabBarHomeIcon,
  TabBarExploreIcon,
  TabBarAddIcon,
  TabBarMarketplaceIcon,
  TabBarProfileIcon,
} from "@/client/assets/icons/expo-icons";
import * as Sentry from "@sentry/react-native";
import "./global.css";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
});

Sentry.mobileReplayIntegration({
  maskAllText: true,
  maskAllImages: true,
  maskAllVectors: true,
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabBarButton = (props: BottomTabBarButtonProps) => (
  <Pressable
    {...props}
    onPress={props.onPress}
    android_ripple={{ color: "transparent" }}
    style={props.style}
  />
);
const AddButton = (props: BottomTabBarButtonProps) => {
  const navigation = useNavigation();
  const handlePress = () => {
      Vibration.vibrate(50);
      navigation.navigate("Add" as never);
    };

  return (
    <Pressable
      {...props}
      onPress={handlePress}
    />
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingHorizontal: 15,
        },
        tabBarButton: TabBarButton,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarHomeIcon({ focused }),
          tabBarIconStyle: {
            marginTop: 12,
          },
          animation: "shift",
          tabBarButton: TabBarButton,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarExploreIcon({ focused }),
          tabBarIconStyle: {
            marginTop: 12,
          },
          tabBarButton: TabBarButton,
        }}
      />
      <Tab.Screen
        name="AddButton"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarAddIcon({ focused }),
          tabBarIconStyle: {
            backgroundColor: "#f0f0f0",
            marginTop: 6,
            width: 55,
            height: 45,
            borderRadius: 15,
          },
          tabBarButton: AddButton,
        }}
      >
        {() => null}
      </Tab.Screen>
      <Tab.Screen
        name="Marketplace"
        component={Marketplace}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarMarketplaceIcon({ focused }),
          tabBarIconStyle: {
            marginTop: 12,
          },
          tabBarButton: TabBarButton,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarProfileIcon({ focused }),
          tabBarIconStyle: {
            marginTop: 12,
          },
          animation: "shift",
          tabBarButton: TabBarButton,
        }}
      />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add"
          component={Add}
          options={{
            presentation: "modal",  
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);