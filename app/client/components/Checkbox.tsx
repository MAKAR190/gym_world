import React from "react";
import { View, Text, Pressable } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import Svg, { Path as SvgPath } from "react-native-svg";

type CheckboxProps = {
  label: string;
  description?: string;
  checked?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export const Checkbox = ({
  label,
  description,
  checked,
  onChange,
  disabled,
}: CheckboxProps) => {
  return (
    <View className="flex flex-row gap-3">
      <View className="flex h-6 shrink-0 items-center">
        <View className="relative h-4 w-4">
          <Pressable
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !!checked, disabled: !!disabled }}
            accessibilityLabel={label}
            accessibilityHint={description}
            className={`h-4 w-4 rounded-sm border ${
              checked
                ? "border-primary-600 bg-primary-600"
                : "border-gray-300 bg-white"
            } ${disabled ? "border-gray-300 bg-gray-100" : ""}`}
            onPress={() => onChange(!checked)}
          />
          {checked && (
            <Svg
              width={14}
              height={14}
              viewBox="0 0 14 14"
              className="absolute left-0 top-0 h-3.5 w-3.5"
            >
              <SvgPath
                d="M3 8L6 11L11 3.5"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
      </View>
      <View className="flex-1">
        <Text
          className={`text-sm ${disabled ? "text-gray-400" : "text-gray-900"}`}
        >
          {label}
        </Text>
        {description && (
          <Text className="text-sm text-gray-500">{description}</Text>
        )}
      </View>
    </View>
  );
};

type CheckboxFieldProps<T extends FieldValues> = Omit<
  CheckboxProps,
  "checked" | "onChange"
> & {
  control: Control<T>;
  name: Path<T>;
};

const CheckboxField = <T extends FieldValues>({
  label,
  name,
  description,
  control,
  disabled,
}: CheckboxFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          label={label}
          description={description}
          checked={field.value}
          onChange={(value) => field.onChange(value)}
          disabled={disabled}
        />
      )}
    />
  );
};

export default CheckboxField;
