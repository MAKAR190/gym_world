import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { View, TextInput, Text, KeyboardTypeOptions } from "react-native";
import { IconType } from "@/types/Icon";
import Label from "./Label";

type AutoCompleteType =
  | "email"
  | "username"
  | "current-password"
  | "new-password"
  | "one-time-code"
  | "tel"
  | "postal-code"
  | "street-address"
  | "address-line1"
  | "address-line2"
  | "country"
  | "name";

type InputProps = {
  id?: string;
  type?: string;
  name?: string;
  autoComplete?: string;
  suffix?: string;
  placeholder?: string;
  errorMessage?: string;
  value: string;
  onChange: (text: string) => void;
  Icon?: IconType;
  saveErrorSpace?: boolean;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "search"
    | "tel"
    | "url"
    | "email";
  style?: object;
};

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      id,
      autoComplete = "text",
      type = "text",
      placeholder,
      errorMessage,
      value,
      onChange,
      saveErrorSpace = true,
      suffix,
      inputMode,
      style,
    },
    ref
  ) => {
    const handleChange = React.useCallback(
      (text: string) => {
        onChange(text);
      },
      [onChange]
    );

    return (
      <View className="relative">
        <View className="flex-row items-center relative">
          <TextInput
            ref={ref}
            testID={id}
            autoComplete={autoComplete as AutoCompleteType}
            secureTextEntry={type === "password"}
            keyboardType={inputMode as KeyboardTypeOptions}
            placeholder={placeholder}
            value={value}
            onChangeText={handleChange}
            className={`w-full rounded-lg bg-background focus:border-primary-600 px-3 py-2.5 font-geist text-md text-foreground border ${
              errorMessage ? "border-red-600" : "border-secondary-300"
            } ${suffix ? "pr-10" : ""}`}
            style={style}
          />
          {suffix && (
            <Text className="absolute right-3 text-foreground font-bold text-md">
              {suffix}
            </Text>
          )}
        </View>
        {(saveErrorSpace || errorMessage) && (
          <Text className="mt-1 text-xs text-red-600">
            {errorMessage ? errorMessage : " "}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

type InputFieldProps<T extends FieldValues> = Omit<
  InputProps,
  "onChange" | "value" | "errorMessage"
> & {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  Icon?: IconType;
};

const InputField = <T extends FieldValues>({
  label,
  id,
  name,
  autoComplete,
  type,
  Icon,
  suffix,
  placeholder,
  required = false,
  control,
  inputMode,
  style,
}: InputFieldProps<T>) => {
  return (
    <View className="mb-2">
      {label && (
        <Label
          Icon={Icon}
          text={label}
          hint={required ? null : "Pole opcjonalne"}
        />
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          return (
            <Input
              {...field}
              id={id}
              type={type}
              onChange={field.onChange}
              autoComplete={autoComplete}
              inputMode={inputMode}
              placeholder={placeholder}
              suffix={suffix}
              errorMessage={fieldState.error?.message}
              style={style}
            />
          );
        }}
      />
    </View>
  );
};

export default InputField;
