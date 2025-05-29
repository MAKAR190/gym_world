import { Alert } from "react-native";
import { AppErrorCodes, AppErrorMessages } from "@/types/AppModels";
import { Buffer } from "buffer";

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
export function formDataToDatabase<
  T extends Record<string, string | number | boolean>
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
  T extends Record<string, string | number | boolean>
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

export function decode(base64: string): Uint8Array {
  try {
    const buffer = Buffer.from(base64, "base64");
    return new Uint8Array(buffer);
  } catch (error) {
    console.error("Error decoding base64 string:", error);
    return new Uint8Array(0);
  }
}

export const calculateReward = (
  reps: number,
  weight: number,
  time: number,
  distance: number
): number => {
  const repsReward = reps * (1000 * 10 ** 18);
  const weightReward = weight * (2000 * 10 ** 18);
  const timeReward = Math.floor(time / 60) * (5000 * 10 ** 18);
  const distanceReward = Math.floor(distance / 1000) * (10000 * 10 ** 18);
  return repsReward + weightReward + timeReward + distanceReward;
};
