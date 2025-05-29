import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, Add } from "@/client/screens";
import {
  TabBarHomeIcon,
  TabBarAddIcon,
  TabBarProfileIcon,
} from "@/client/assets/icons/expo-icons";
import { TabBarButton, AddButton } from "./TabBarComponents";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingHorizontal: 15,
        },
        tabBarButton: TabBarButton,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarHomeIcon({ focused }),
          tabBarIconStyle: {
            marginTop: 12,
          },
          animation: "shift",
          tabBarButton: TabBarButton,
        }}
      />
      {/* // TODO: Add Explore Screen
      
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarExploreIcon({ focused }),
          tabBarIconStyle: {
            marginTop: 12,
          },
          tabBarButton: TabBarButton,
        }}
      /> */}
      <Tab.Screen
        name="Add"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarAddIcon({ focused }),
          tabBarIconStyle: {
            backgroundColor: "#f0f0f0",
            marginTop: 6,
            width: 55,
            height: 45,
            borderRadius: 15,
          },
          tabBarButton: AddButton,
        }}
        component={Add}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            TabBarProfileIcon({ focused }),
          tabBarIconStyle: {
            marginTop: 12,
          },
          animation: "shift",
          tabBarButton: TabBarButton,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
