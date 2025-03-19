import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import * as Sentry from "@sentry/react-native";
import "./global.css";

Sentry.init({
  dsn: "https://d3f80e0055f4d9ef660da8b139676b87@o4509006633893888.ingest.de.sentry.io/4509006638153808",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold py-5">
        Open up App.tsx to start working on your app!
      </Text>
      <View className="w-10 h-10 bg-blue-500" />
      <StatusBar style="auto" />
    </View>
  );
}

export default Sentry.wrap(App);
