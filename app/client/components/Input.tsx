import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { View, TextInput, Text, KeyboardTypeOptions } from "react-native";
import Label from "@/client/components/Label";
import { ExpoIconComponent } from "@/types/ExpoIcon";

type AutoCompleteType =  "email" | "username" | "current-password" | "new-password" | "one-time-code" | "tel" | "postal-code" | "street-address" | "address-line1" | "address-line2" | "country" | "name";

type InputProps = {
  id: string;
  type?: string;
  name?: string;
  autoComplete?: string;
  suffix?: string;
  placeholder?: string;
  errorMessage?: string;
  value: string;
  onChange: (text: string) => void;
  Icon?: {
    Component: ExpoIconComponent;
    name: string;
    size: number;
    color: string;
    className?: string;
  };
  saveErrorSpace?: boolean;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "search"
    | "tel"
    | "url"
    | "email";
};

export const Input = ({
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
}: InputProps) => {
  return (
    <View className="relative">
      <View className="flex items-center">
        <TextInput
          id={id}
          autoComplete={autoComplete as AutoCompleteType}
          secureTextEntry={type === "password"}
          keyboardType={inputMode as KeyboardTypeOptions}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          className={`block w-full rounded-md bg-background px-3 py-1.5 text-base text-foreground outline-1 outline-gray-300 focus:outline-2 focus:outline-primary-500 transition-all duration-100 ease-in sm:text-sm ${
            errorMessage ? "outline-secondary-600" : ""
          } ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <Text className="absolute right-3 text-foreground text-bold text-sm">
            {suffix}
          </Text>
        )}
      </View>
      {(saveErrorSpace || errorMessage) && (
        <Text
          className={`mt-1 text-xs text-secondary-600 ${
            saveErrorSpace ? "whitespace-pre-wrap" : ""
          }`}
        >
          {errorMessage ? errorMessage : " "}
        </Text>
      )}
    </View>
  );
};

type InputFieldProps<T extends FieldValues> = Omit<
  InputProps,
  "onChange" | "value" | "errorMessage"
> & {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  sidebarNarrowed?: boolean;
  Icon?: {
    Component: ExpoIconComponent;
    name: string;
    size: number;
    color: string;
    className?: string;
  };
};

const InputField = <T extends FieldValues>({
  label,
  id,
  name,
  autoComplete,
  type,
  Icon,
  sidebarNarrowed,
  suffix,
  placeholder,
  required = false,
  control,
  inputMode,
}: InputFieldProps<T>) => {
  return (
    <View>
      {label && (
        <Label
          Icon={Icon}
          text={label}
          hint={required ? null : "Pole opcjonalne"}
          sidebarNarrowed={sidebarNarrowed}
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
              autoComplete={autoComplete}
              inputMode={inputMode}
              placeholder={placeholder}
              suffix={suffix}
              errorMessage={fieldState.error?.message}
              onChange={field.onChange}
              Icon={Icon}
            />
          );
        }}
      />
    </View>
  );
};

export default InputField;
