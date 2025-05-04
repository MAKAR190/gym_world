import React from "react";
import { classNames } from "@/utils/helpers";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { IconType } from "@/types/Icon";

export interface ButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  text: string;
  Icon?: IconType;
}

interface VariantStylesProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export const VARIANT_STYLES = {
  primary: ({ disabled, isLoading }: VariantStylesProps) =>
    `${disabled ? "bg-primary-100 cursor-not-allowed" : "bg-primary-500"} ${
      isLoading ? "text-transparent cursor-wait" : "text-white"
    } flex w-full justify-center rounded-md px-5 py-4 shadow-sm active:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`,
  secondary: ({ disabled, isLoading }: VariantStylesProps) =>
    `${disabled ? "bg-secondary-100" : "bg-white"} ${
      isLoading ? "text-transparent" : "text-secondary-900"
    } flex w-full items-center justify-center gap-3 rounded-md px-5 py-3 text-sm font-semibold 
  border border-secondary-300
  ${disabled ? "" : "active:bg-secondary-50"}`,
};

const Button = ({
  isLoading,
  className = "",
  disabled,
  variant = "primary",
  text,
  Icon,
  ...rest
}: ButtonProps) => {
  const disable = disabled || isLoading;

  return (
    <TouchableOpacity
      {...rest}
      disabled={disable}
      className={classNames(
        VARIANT_STYLES[variant]({
          isLoading,
          disabled,
        }),
        className
      )}
    >
      {isLoading ? (
        <ActivityIndicator
          className="flex items-center justify-center"
          size={20}
        />
      ) : (
        <View className="flex-row items-center justify-center gap-3">
          {Icon && (
            <View>
              {Icon.type === "expo" ? (
                <Icon.Component
                  name={Icon.name || ""}
                  size={Icon.size || 24}
                  color={
                    Icon.color || (variant === "primary" ? "white" : "black")
                  }
                  className={Icon.className}
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
                      className: classNames(
                        Icon.className ?? "",
                        "relative top-0"
                      ),
                    }
                  )}
                </View>
              )}
            </View>
          )}
          <Text
            className={classNames(
              variant === "primary"
                ? "text-white font-inter font-semibold"
                : "text-foreground font-geist font-semibold",
              "text-lg text-center"
            )}
          >
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
