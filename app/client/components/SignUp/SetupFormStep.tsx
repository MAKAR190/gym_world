import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SignUpFormType } from "@/types/FormModels";
import { InjectedProps } from "@/client/hocs/WithZodForm";
import { WithZodForm } from "@/client/hocs";
import InputField from "@/client/components/Input";
import Button from "@/client/components/Button";
import RadioField from "@/client/components/Radio";

const SetupFormStep = ({
  form,
  handleFormSubmit,
}: InjectedProps<SignUpFormType>) => {
  const { control } = form;

  return (
    <View className="px-6">
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4">
          1. Kilograms or Pounds?
        </Text>
        <View className="flex-row gap-4">
          <RadioField
            control={control}
            name="weightunit"
            value="kg"
            label="Kilograms"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "weight-kilogram",
              color: "black",
              size: 20,
              type: "expo",
            }}
          />
          <RadioField
            control={control}
            name="weightunit"
            value="lbs"
            label="Pounds"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "weight-pound",
              color: "black",
              size: 20,
              type: "expo",
            }}
          />
        </View>
      </View>
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4">
          2. Centimeters or Feet?
        </Text>
        <View className="flex-row gap-4">
          <RadioField
            control={control}
            name="heightunit"
            value="cm"
            label="Centimeters"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "human-male-height",
              color: "black",
              size: 20,
              type: "expo",
            }}
          />
          <RadioField
            control={control}
            name="heightunit"
            value="ft"
            label="Feet"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "human-male-height-variant",
              color: "black",
              size: 20,
              type: "expo",
            }}
          />
        </View>
      </View>
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4">
          2. What is your gender?
        </Text>
        <View className="flex-row gap-4">
          <RadioField
            control={control}
            name="gender"
            value="male"
            label="Male"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "gender-male",
              color: "black",
              size: 20,
              type: "expo",
            }}
          />
          <RadioField
            control={control}
            name="gender"
            value="female"
            label="Female"
            Icon={{
              Component: MaterialCommunityIcons,
              name: "gender-female",
              color: "black",
              size: 20,
              type: "expo",
            }}
          />
        </View>
      </View>
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4">
          3. What is your bodyweight? (in {form.watch("weightunit")})
        </Text>
        <InputField
          control={control}
          name="bodyweight"
          label="Bodyweight"
          inputMode="numeric"
          type="number"
        />
      </View>
      <Text className="text-lg font-semibold mb-4">
        4. What is your height? (in {form.watch("heightunit")})
      </Text>
      <InputField
        control={control}
        name="height"
        label="Height"
        inputMode={form.watch("heightunit") === "cm" ? "numeric" : "text"}
      />
      <Text className="text-2xl font-bold mb-5">Enter Details</Text>
      <View className="mb-6">
        <InputField
          control={control}
          name="emailOrUsername"
          label="Email or Username"
          inputMode="text"
        />
      </View>
      <View className="mb-6">
        <InputField
          control={control}
          name="password"
          label="Password"
          type="password"
        />
      </View>
      <View className="mb-4">
        <View className="flex-1">
          <Button variant="secondary" onPress={handleFormSubmit} text="Next" />
        </View>
      </View>
    </View>
  );
};

const SetupFormWithZod = WithZodForm<SignUpFormType>(SetupFormStep);

export default SetupFormWithZod;
