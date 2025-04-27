import React from "react";
import { IconType } from "@/types/Icon";
import { classNames } from "@/utils/helpers";
import { View, Text } from "react-native";

interface LabelProps {
  Icon?: IconType;
  hint?: string | React.ReactNode;
  text?: string | React.ReactNode;
  className?: string;
}

const Label = ({ Icon, hint, text, className = "" }: LabelProps) => {
  return (
    <View
      className={`text-md space-x-1 flex flex-row justify-start items-center mb-2 ${className}`}
    >
      {Icon && (
        <View>
          {Icon.type === "expo" ? (
            <Icon.Component
              name={Icon.name || ""}
              size={Icon.size || 24}
              color={Icon.color || "black"}
              className={classNames(Icon.className ?? "", "relative top-0")}
            />
          ) : (
            <View>
              {React.createElement(
                Icon.Component as React.FC<{
                  width: number;
                  height: number;
                  className?: string;
                }>,
                {
                  width: Icon.size || 24,
                  height: Icon.size || 24,
                  className: classNames(Icon.className ?? "", "relative top-0"),
                }
              )}
            </View>
          )}
        </View>
      )}
      <Text className="text-foreground font-medium">{text}</Text>
      {hint && (
        <View className="relative">
          <View
            className={`flex flex-row items-center sm:hidden md:hidden lg:block xl:hidden`}
          >
            <View className="absolute left-0 bottom-full mb-2 hidden group-focus:block group-hover:block w-max bg-gray-700 rounded-md shadow-lg">
              <Text className="text-white text-xs p-2">{hint}</Text>
            </View>
          </View>

          <View
            className={`hidden sm:flex md:flex lg:hidden xl:flex flex-row text-xs pt-0.5 font-semibold text-gray-600`}
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
