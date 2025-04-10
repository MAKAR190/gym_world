import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ExpoIconComponent } from "@/types/ExpoIcon";
import { classNames } from "@/utils/helpers";
import { View, Text, Pressable } from "react-native";

interface LabelProps {
  Icon?: {
    Component: ExpoIconComponent;
    name: string;
    size: number;
    color: string;
    className?: string;
  };
  hint?: string | React.ReactNode;
  text?: string | React.ReactNode;
  className?: string;
  sidebarNarrowed?: boolean;
}

const Label = ({
  Icon,
  hint,
  text,
  sidebarNarrowed = false,
  className = "",
}: LabelProps) => {
  return (
    <View
      className={`text-md space-x-1 flex flex-row justify-start items-center font-medium text-foreground mb-1 ${className}`}
    >
      {Icon && (
        <Icon.Component
          name={Icon.name}
          size={Icon.size}
          color={Icon.color}
          className={classNames(Icon.className ?? "", "relative top-0")}
        />
      )}
      <Text>{text}</Text>
      {hint && (
        <View className="relative">
          <View
            className={`flex flex-row items-center sm:hidden md:hidden ${sidebarNarrowed ? "lg:block" : "lg:hidden"} xl:hidden`}
          >
            <Pressable>
              <FontAwesome
                name="question-circle-o"
                size={20}
                color="black"
              />
            </Pressable>
            <View className="absolute left-0 bottom-full mb-2 hidden group-focus:block group-hover:block w-max bg-gray-700 rounded-md shadow-lg">
              <Text className="text-white text-xs p-2">{hint}</Text>
            </View>
          </View>

          <View
            className={`hidden sm:flex md:flex ${sidebarNarrowed ? "lg:hidden" : "lg:flex"} xl:flex flex-row text-xs pt-0.5 font-medium text-gray-600`}
          >
            <Text>-</Text>
            <Text> {hint}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Label;
