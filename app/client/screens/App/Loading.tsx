import LottieView from "lottie-react-native";
import { View } from "react-native";

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={require("../../assets/animations/falling-man-animation.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
};

export default Loading;
