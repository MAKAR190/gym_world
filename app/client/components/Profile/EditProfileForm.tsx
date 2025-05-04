import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { InputField, RadioField, Button } from "@/client/components";
import { EditProfileFormType } from "@/types/FormModels";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  requestMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import withZodForm, { InjectedProps } from "@/client/hocs/WithZodForm";

const EditProfileFormComponent = ({
  form,
  handleFormSubmit,
}: InjectedProps<EditProfileFormType>) => {
  const { control, watch } = form;
  return (
    <View>
      <View className="mt-10 space-y-8">
        <View className="space-y-2">
          <InputField control={control} name="username" label="Username" />
        </View>

        <View className="mb-8 flex flex-col">
          <InputField maxLength={25} control={control} name="bio" label="Bio" />
          <Text className="text-sm text-gray-600">
            Write a few sentences about yourself.{" "}
            {25 - (watch("bio")?.length || 0)} characters remaining
          </Text>
        </View>

        <View className="space-y-2">
          <InputField
            control={control}
            name="height"
            label="Height"
            inputMode="numeric"
            type="number"
          />
        </View>

        <View className="space-y-2">
          <InputField
            control={control}
            name="bodyweight"
            label="Bodyweight"
            inputMode="numeric"
            type="number"
          />
        </View>

        <View className="space-y-2 mt-6">
          <Text className="text-sm font-medium text-foreground">
            Profile Picture
          </Text>
          <View className="flex flex-row items-center gap-3 my-2">
            {watch("profile_picture") ? (
              <Image
                source={{ uri: watch("profile_picture") }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <FontAwesome name="user-circle" size={48} color="#ccc" />
            )}
            <View className="flex flex-row gap-2">
              <TouchableOpacity
                className="bg-white text-sm font-semibold text-primary-600 px-3 py-1 rounded-md border border-primary-600"
                onPress={async () => {
                  const { status } =
                    await requestMediaLibraryPermissionsAsync();
                  if (status !== "granted") {
                    Alert.alert(
                      "Permission Required",
                      "We need permission to access your photos to set a profile picture."
                    );
                    return;
                  }

                  const result = await launchImageLibraryAsync({
                    mediaTypes: "images",
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });

                  if (!result.canceled) {
                    form.setValue("profile_picture", result.assets[0].uri, {
                      shouldDirty: true,
                    });
                  }
                }}
              >
                <Text className="text-primary-600">Upload Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white text-sm font-semibold text-primary-600 px-3 py-1 rounded-md border border-primary-600"
                onPress={async () => {
                  const { status } = await requestCameraPermissionsAsync();
                  if (status !== "granted") {
                    Alert.alert(
                      "Permission Required",
                      "We need permission to access your photos to set a profile picture."
                    );
                    return;
                  }

                  const result = await launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });

                  if (!result.canceled) {
                    form.setValue("profile_picture", result.assets[0].uri, {
                      shouldDirty: true,
                    });
                  }
                }}
              >
                <Text className="text-primary-600">Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-10">
        <Text className="text-xl font-semibold text-foreground">
          Personal Information
        </Text>
        <Text className="mt-1 text-sm text-gray-600">
          Use a real email address where you can receive mail.
        </Text>

        <View className="mt-4 space-y-8">
          <View className="space-y-2">
            <InputField control={control} name="email" label="Email" />
          </View>
        </View>
      </View>
      <View className="pb-12 w-full">
        <Text className="text-xl font-semibold text-foreground">Other</Text>
        <Text className="text-sm mt-4 font-medium text-foreground">
          Notifications
        </Text>
        <View className="flex flex-row gap-4 w-full mt-4">
          <RadioField
            control={control}
            name="notifications"
            label="On"
            value={true}
            Icon={{
              Component: MaterialIcons,
              name: "notifications-on",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
          <RadioField
            control={control}
            name="notifications"
            label="Off"
            value={false}
            Icon={{
              Component: MaterialIcons,
              name: "notifications-off",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
        </View>
        <Text className="text-sm mt-4 font-medium text-foreground">Gender</Text>
        <View className="flex flex-row gap-4 w-full mt-4">
          <RadioField
            control={control}
            name="gender"
            label="Male"
            value="male"
            Icon={{
              Component: MaterialIcons,
              name: "male",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
          <RadioField
            control={control}
            name="gender"
            label="Female"
            value="female"
            Icon={{
              Component: MaterialIcons,
              name: "female",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
        </View>
        <Text className="text-sm mt-4 font-medium text-foreground">
          Weight Unit
        </Text>
        <View className="flex flex-row gap-4 w-full mt-4">
          <RadioField
            control={control}
            name="weightunit"
            label="KG"
            value="kg"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "weight-kilogram",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
          <RadioField
            control={control}
            name="weightunit"
            label="LBS"
            value="lbs"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "weight-pound",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
        </View>
        <Text className="text-sm mt-4 font-medium text-foreground">
          Height Unit
        </Text>
        <View className="flex flex-row gap-4 w-full mt-4">
          <RadioField
            control={control}
            name="heightunit"
            label="CM"
            value="cm"
            Icon={{
              Component: MaterialIcons,
              name: "height",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
          <RadioField
            control={control}
            name="heightunit"
            label="FT"
            value="ft"
            Icon={{
              Component: MaterialIcons,
              name: "height",
              color: "black",
              size: 20,
              type: "expo",
            }}
            className="min-w-[45%]"
          />
        </View>
      </View>

      <Button
        onPress={handleFormSubmit}
        text="Change"
        disabled={!form.formState.isDirty}
      />
    </View>
  );
};

const EditProfileForm = withZodForm<EditProfileFormType>(
  EditProfileFormComponent
);

export default EditProfileForm;
