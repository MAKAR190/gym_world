import { Alert } from "react-native";
import { AppErrorCodes, AppErrorMessages } from "@/types/AppModels";
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
export function formDataToDatabase<
  T extends Record<string, string | number | boolean>,
>(formData: T): Record<string, string | number | boolean> {
  const processedData: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string" && !isNaN(Number(value))) {
      processedData[key] = Number(value);
    } else if (typeof value === "boolean") {
      processedData[key] = value ? 1 : 0;
    } else {
      processedData[key] = value;
    }
  }

  return processedData;
}

export function databaseToFormData<
  T extends Record<string, string | number | boolean>,
>(databaseData: T): Record<string, string | number | boolean> {
  const processedData: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(databaseData)) {
    if (typeof value === "number") {
      processedData[key] = value.toString();
    } else if (typeof value === "boolean") {
      processedData[key] = value ? "1" : "0";
    } else {
      processedData[key] = value;
    }
  }

  return processedData;
}
export const isEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

export function handleError(errorCode: AppErrorCodes) {
  Alert.alert("Error", AppErrorMessages[errorCode], [{ text: "OK" }]);
}