import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import "./global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold py-5">Open up App.tsx to start working on your app!</Text>
      <View className="w-10 h-10 bg-blue-500" />
      <StatusBar style="auto" />
    </View>
  );
}
