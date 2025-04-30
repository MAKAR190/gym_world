import { View, Text } from "react-native";
import { auth } from "@/client/hooks";
import { signOut } from "@/server/services/auth";
import { Button } from "@/client/components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/AppModels";

const Profile = () => {
  const { user } = auth.useSession();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <View>
      <Text>{user?.user_metadata?.username}</Text>
      <Button text="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;
