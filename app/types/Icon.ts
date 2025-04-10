export type IconType = {
  type: "expo" | "svg";
  Component: typeof import("@expo/vector-icons").AntDesign |
    typeof import("@expo/vector-icons").Entypo |
    typeof import("@expo/vector-icons").EvilIcons |
    typeof import("@expo/vector-icons").Feather |
    typeof import("@expo/vector-icons").FontAwesome |
    typeof import("@expo/vector-icons").FontAwesome5 |
    typeof import("@expo/vector-icons").Fontisto |
    typeof import("@expo/vector-icons").Foundation |
    typeof import("@expo/vector-icons").Ionicons |
    typeof import("@expo/vector-icons").MaterialCommunityIcons |
    typeof import("@expo/vector-icons").MaterialIcons |
    typeof import("@expo/vector-icons").Octicons |
    typeof import("@expo/vector-icons").SimpleLineIcons |
    typeof import("@expo/vector-icons").Zocial;
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};