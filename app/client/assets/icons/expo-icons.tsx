import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

export const TabBarHomeIcon = ({ focused }: { focused: boolean }) => (
<Octicons name="home" size={28} color={focused ? "#000" : "gray"} />
);
export const TabBarExploreIcon = ({ focused }: { focused: boolean }) => (
  <Octicons name="search" size={28} color={focused ? "#000" : "gray"} />
);
export const TabBarAddIcon = ({ focused }: { focused: boolean }) => (
  <MaterialIcons name="add" size={32} color={focused ? "#000" : "gray"} />
);
export const TabBarMarketplaceIcon = ({ focused }: { focused: boolean }) => (
  <Ionicons name="cart" size={28} color={focused ? "#000" : "gray"} />
);
export const TabBarProfileIcon = ({ focused }: { focused: boolean }) => (
  <Octicons name="person" size={28} color={focused ? "#000" : "gray"} />
);