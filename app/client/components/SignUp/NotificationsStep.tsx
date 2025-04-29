import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { classNames } from "@/utils/helpers";
import { SignUpFormType } from "@/types/FormModels";
import Title from "@/client/components/Title";
import LottieView from "lottie-react-native";

const NotificationsStep = ({
  onNotificationsChange,
  formData,
}: {
  onNotificationsChange: (value: boolean) => void;
  formData: SignUpFormType | null;
}) => {
  const [isChecked, setIsChecked] = useState(formData?.notifications);

  const handleCheckChange = (value: boolean) => {
    setIsChecked(value);
    onNotificationsChange(value);
  };

  return (
    <View className="flex-1 justify-evenly items-center">
      <View className="flex-1 justify-center items-center">
        <Title variant="extra-large">Should we notify you?</Title>
        <LottieView
          source={require("@/client/assets/animations/notify-animation.json")}
          autoPlay={true}
          loop={true}
          style={{ width: 300, height: 300 }}
          speed={1.5}
        />
      </View>
      <View className="flex-row mb-24 w-[90%] justify-center items-center gap-2">
        <TouchableOpacity
          className="flex-row w-1/2 items-center gap-2"
          onPress={() => handleCheckChange(true)}
        >
          <View
            className={classNames(
              "rounded-lg w-full min-h-40 flex justify-center items-center flex-col p-10",
              isChecked ? "bg-primary-800" : "bg-primary-300"
            )}
          >
            <MaterialIcons name="notifications-on" size={50} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row w-1/2 items-center gap-2"
          onPress={() => handleCheckChange(false)}
        >
          <View
            className={classNames(
              "rounded-lg w-full min-h-40 flex justify-center items-center flex-col p-10",
              !isChecked ? "bg-primary-800" : "bg-primary-300"
            )}
          >
            <MaterialIcons name="notifications-off" size={50} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationsStep;
