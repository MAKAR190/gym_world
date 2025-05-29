import "@walletconnect/react-native-compat";
import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthProvider } from "@/client/contexts";
import { WalletProvider } from "@/client/contexts/WalletContext";
import { ProtectedRoute } from "@/client/components";
import { MainTabNavigator } from "@/client/components/App";
import {
  SignUp,
  Login,
  EditProfile,
  Workout,
  Exercises,
  WorkoutHistory,
  WorkoutStats,
  Comments,
} from "@/client/screens";
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
import "./global.css";
import { WorkoutProvider } from "@/client/contexts/WorkoutContext";
import { ProtectedWorkoutRoute } from "@/client/components/ProtectedWorkoutRoute";
import { WorkoutHeader } from "@/client/components/WorkoutHeader";
import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "@/server/services/notifications";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { auth } from "@/client/hooks";
import * as Device from "expo-device";
import Loading from "@/client/screens/App/Loading";
// Initialize NetInfo for WalletConnect
// @ts-ignore
global.NetInfo = {
  fetch: () => NetInfo.fetch(),
  addEventListener: (callback: (state: NetInfoState) => void) =>
    NetInfo.addEventListener(callback),
  removeEventListener: () => {
    // No-op for compatibility
  },
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Test notification function
export const scheduleTestNotification = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    // Schedule a test notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification",
        data: { type: "workout_reminder" },
      },
      trigger: null, // Show immediately
    });

    console.log("Test notification scheduled!");
  } catch (error) {
    console.error("Error scheduling test notification:", error);
  }
};

// Test notification functions
export const scheduleWorkoutCompletionNotification = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    // Schedule a workout completion notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Workout Completed! 🎉",
        body: "Great job! You've earned 50 GWC tokens for completing your workout.",
        data: { type: "achievement" },
      },
      trigger: null,
    });

    console.log("Workout completion notification scheduled!");
  } catch (error) {
    console.error("Error scheduling workout completion notification:", error);
  }
};

export const scheduleWorkoutLikeNotification = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    // Schedule a workout like notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Like! ❤️",
        body: "Someone liked your workout! Keep up the great work!",
        data: { type: "achievement" },
      },
      trigger: null,
    });

    console.log("Workout like notification scheduled!");
  } catch (error) {
    console.error("Error scheduling workout like notification:", error);
  }
};

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

// Create a component to handle notifications
const NotificationHandler = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();

    // Listen for incoming notifications while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener(
        (notification: Notifications.Notification) => {
          console.log("Notification received:", notification);
        }
      );

    // Listen for user interactions with notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        (response: Notifications.NotificationResponse) => {
          console.log("Notification response:", response);
          const data = response.notification.request.content.data as {
            type: "workout_reminder" | "achievement";
          };

          if (data.type === "workout_reminder") {
            navigation.navigate("Workout");
          } else if (data.type === "achievement") {
            navigation.navigate("Tabs", { screen: "Profile" });
          }
        }
      );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [navigation]);

  return null;
};

// Create a wrapper component that includes all providers that need navigation
const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <WorkoutProvider>{children}</WorkoutProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Create a separate component to handle auth state
const AuthStateManager = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = auth.useSession();
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const prevSessionRef = useRef(session);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Handle session changes
  useEffect(() => {
    // Only handle navigation if we had a session before and now we don't
    if (!isLoading && prevSessionRef.current && !session) {
      console.log("Session lost, initiating cleanup sequence");

      // Force a UI update
      setForceUpdate((prev) => prev + 1);

      // Clear cache immediately
      queryClient.clear();

      // Reset all queries
      queryClient.resetQueries();

      // Force refetch session
      queryClient.refetchQueries({ queryKey: ["session"] });

      // Reset navigation after a short delay
      setTimeout(() => {
        console.log("Resetting navigation to Login");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 100);
    }

    // Update the ref with current session
    prevSessionRef.current = session;
  }, [session, isLoading, queryClient, navigation]);

  // Force re-render when session changes
  useEffect(() => {
    if (!session) {
      console.log("No session, forcing re-render");
      setForceUpdate((prev) => prev + 1);
    }
  }, [session]);

  if (isLoading) {
    console.log("AuthStateManager: Loading state");
    return <Loading />;
  }

  console.log(
    "AuthStateManager: Rendering with session:",
    !!session,
    "forceUpdate:",
    forceUpdate
  );
  return <>{children}</>;
};

const AppNavigator = () => {
  const { session, isLoading } = auth.useSession();
  const [key, setKey] = useState(0);

  // Force re-render when session changes
  useEffect(() => {
    if (!session) {
      console.log("AppNavigator: No session, forcing re-render");
      setKey((prev) => prev + 1);
    }
  }, [session]);

  console.log("AppNavigator render:", { session, isLoading, key });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator
      key={key}
      screenOptions={{
        headerShown: false,
      }}
    >
      {!session ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Tabs"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <ProtectedRoute>
                <MainTabNavigator />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="EditProfile"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Workout"
            options={{
              header: () => <WorkoutHeader />,
            }}
          >
            {() => (
              <ProtectedWorkoutRoute>
                <Workout />
              </ProtectedWorkoutRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Exercises"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <ProtectedRoute>
                <Exercises />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="WorkoutHistory"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <ProtectedRoute>
                <WorkoutHistory />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="WorkoutStats"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <ProtectedRoute>
                <WorkoutStats />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Comments"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <ProtectedRoute>
                <Comments />
              </ProtectedRoute>
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const [interFontsLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [geistFontsLoaded] = useGeistFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    Geist_900Black,
  });

  useEffect(() => {
    if (interFontsLoaded && geistFontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [interFontsLoaded, geistFontsLoaded]);

  if (!interFontsLoaded || !geistFontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppProviders>
        <NotificationHandler />
        <AuthStateManager>
          <AppNavigator />
        </AuthStateManager>
      </AppProviders>
    </NavigationContainer>
  );
}
