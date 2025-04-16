import { Pressable, Vibration } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Explore, Add, Marketplace, Profile } from "@/client/screens";
import ForgotPassword from "@/client/screens/ForgotPassword";

import {
  TabBarHomeIcon,
  TabBarExploreIcon,
  TabBarAddIcon,
  TabBarMarketplaceIcon,
  TabBarProfileIcon,
} from "@/client/assets/icons/expo-icons";
import {
  useFonts as useInterFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import {
  useFonts as useGeistFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
  Geist_900Black,
} from "@expo-google-fonts/geist";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import "./global.css";
import { useEffect } from "react";
import { RootStackParamList } from "@/types/AppModels";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handlePress = () => {
    Vibration.vibrate(50);
    navigation.navigate("Add");
  };

  return <Pressable {...props} onPress={handlePress} />;
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
  const [interFontsLoaded, interFontsError] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [geistFontsLoaded, geistFontsError] = useGeistFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    Geist_900Black,
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    if (
      (interFontsLoaded && geistFontsLoaded) ||
      (interFontsError && geistFontsError)
    ) {
      SplashScreen.hideAsync();
    }
  }, [interFontsLoaded, interFontsError, geistFontsLoaded, geistFontsError]);

  const fontsReady =
    (interFontsLoaded || interFontsError) &&
    (geistFontsLoaded || geistFontsError);

  if (!fontsReady) {
    return null;
  }

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
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            animation: "ios_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);
