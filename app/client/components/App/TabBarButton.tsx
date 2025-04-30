import { Pressable } from "react-native";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

const TabBarButton = (props: BottomTabBarButtonProps) => (
  <Pressable
    {...props}
    onPress={props.onPress}
    android_ripple={{ color: "transparent" }}
    style={props.style}
  />
);

export default TabBarButton;
