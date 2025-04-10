import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Zocial from "@expo/vector-icons/Zocial";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
  name?: string;
  style?: React.CSSProperties;
};

type IconComponent = React.ComponentType<IconProps>;

export type ExpoIconComponent = IconComponent;

type ExpoIcon =
  | typeof FontAwesome
  | typeof MaterialIcons
  | typeof MaterialCommunityIcons
  | typeof Ionicons
  | typeof AntDesign
  | typeof Entypo
  | typeof EvilIcons
  | typeof Feather
  | typeof Foundation
  | typeof Octicons
  | typeof SimpleLineIcons
  | typeof Zocial;

export type { IconProps };
export default ExpoIcon;