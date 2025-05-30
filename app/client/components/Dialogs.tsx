import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AlertDialogProps {
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AlertDialog = ({
  title,
  description,
  confirmText,
  onConfirm,
  open,
  setOpen,
}: AlertDialogProps) => {
  return (
    <Modal
      transparent={true}
      visible={open}
      animationType="slide"
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1 justify-center items-center bg-foreground bg-opacity-50">
        <View className="bg-background rounded-lg p-8 shadow-xl w-[90%] min-h-[300px]">
          <View className="flex-row items-center justify-center mb-6">
            <View className="bg-red-100 p-3 rounded-full">
              <Ionicons name="alert-circle-outline" size={40} color="red" />
            </View>
          </View>
          <View className="text-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            <Text className="text-sm text-gray-500 mt-2">{description}</Text>
          </View>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="bg-red-600 px-4 py-2 rounded-md"
              onPress={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              <Text className="text-background text-center text-sm font-semibold">
                {confirmText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white px-4 py-2 rounded-md border border-gray-300"
              onPress={() => setOpen(false)}
            >
              <Text className="text-foreground text-center text-sm font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
