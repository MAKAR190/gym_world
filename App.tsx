import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/client/contexts";
import { ProtectedRoute } from "@/client/components";
import { MainTabNavigator } from "@/client/components/App";
import {
  SignUp,
  Login,
  Add,
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
import * as Sentry from "@sentry/react-native";
import "./global.css";
import "react-native-url-polyfill/auto";

if (!process.env.EXPO_PUBLIC_SENTRY_DSN) {
  throw new Error("SENTRY_DSN is not set");
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
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

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{
                animation: "ios_from_right",
                gestureEnabled: true,
                gestureDirection: "horizontal",
                headerShown: false,
              }}
            />
            <Stack.Screen name="Tabs" options={{ headerShown: false }}>
              {() => (
                <ProtectedRoute>
                  <MainTabNavigator />
                </ProtectedRoute>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Add"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            >
              {() => (
                <Add />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(App);
