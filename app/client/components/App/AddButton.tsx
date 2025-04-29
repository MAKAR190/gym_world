import { Pressable, Vibration } from "react-native";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";

const AddButton = (props: BottomTabBarButtonProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handlePress = () => {
    Vibration.vibrate(50);
    navigation.navigate("Add");
  };

  return <Pressable {...props} onPress={handlePress} />;
};

export default AddButton;
