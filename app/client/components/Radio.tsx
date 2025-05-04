import React from "react";
import { View, Text, Pressable } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { IconType } from "@/types/Icon";
import { classNames } from "@/utils/helpers";

type RadioProps = {
  label?: string;
  Icon?: IconType;
  value: string;
  selectedValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export const Radio = ({
  label,
  Icon,
  value,
  selectedValue,
  onChange,
  disabled,
  className,
}: RadioProps) => {
  return (
    <View className={classNames("mb-2 ml-2 w-full min-w-28", className)}>
      <Pressable
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{
          checked: value === selectedValue,
          disabled: !!disabled,
        }}
        accessibilityLabel={label}
        className={`rounded-lg w-full items-center justify-center
          ${
            value === selectedValue ? "bg-primary-800" : "bg-primary-100"
          } ${disabled ? "bg-gray-100" : ""}`}
        onPress={() => onChange(value)}
      >
        <View className="flex-col p-5 items-center justify-center gap-2">
          {Icon && (
            <Icon.Component
              name={Icon.name}
              size={32}
              color={value === selectedValue ? "white" : "black"}
            />
          )}
          {label && (
            <Text
              className={`text-base font-medium ${
                disabled
                  ? "text-gray-400"
                  : value === selectedValue
                    ? "text-white"
                    : "text-foreground"
              }`}
            >
              {label}
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
};

type RadioFieldProps<T extends FieldValues> = Omit<
  RadioProps,
  "onChange" | "selectedValue" | "errorMessage"
> & {
  name: Path<T>;
  control: Control<T>;
  Icon?: IconType;
};

const RadioField = <T extends FieldValues>({
  label,
  name,
  value,
  control,
  disabled,
  Icon,
  className,
}: RadioFieldProps<T>) => {
  return (
    <View className="mb-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Radio
            value={value}
            label={label}
            Icon={Icon}
            selectedValue={field.value}
            onChange={field.onChange}
            disabled={disabled}
            className={className}
          />
        )}
      />
    </View>
  );
};

export default RadioField;
