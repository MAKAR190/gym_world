import { Title, Button } from "@/client/components";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";
import { useWorkout } from "@/client/contexts/WorkoutContext";

const Add = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { startWorkout } = useWorkout();

  const handleStartWorkout = () => {
    startWorkout();
    navigation.navigate("Workout");
  };

  return (
    <View className="flex-1 items-start justify-start pt-24 px-8 gap-y-4">
      <Title variant="extra-large">Quick Start</Title>
      <Button
        text="Start a new workout"
        Icon={{
          Component: AntDesign,
          name: "plus",
          size: 24,
          color: "white",
          type: "expo",
        }}
        contentClassName="self-start"
        onPress={handleStartWorkout}
      />
    </View>
  );
};

export default Add;
