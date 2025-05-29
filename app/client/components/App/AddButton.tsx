import { Pressable, Vibration, GestureResponderEvent } from "react-native";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

const AddButton = (props: BottomTabBarButtonProps) => {
  const handlePress = (e: GestureResponderEvent) => {
    Vibration.vibrate(50);
    props.onPress?.(e);
  };

  return <Pressable {...props} onPress={handlePress} />;
};

export default AddButton;
