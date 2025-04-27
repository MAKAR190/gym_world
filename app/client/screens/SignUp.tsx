import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import StepIndicator from "react-native-step-indicator";
import {
  WIZARD_STYLES,
  WIZARD_LABELS,
  SETUP_FORM_MODULE,
} from "@/utils/constants";
import { InjectedProps, withZodForm } from "../hocs/WithZodForm";
import { SignUpFormType } from "@/types/FormModels";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { RadioField, InputField, Button, Title } from "../components";
import { SceneMap, TabView } from "react-native-tab-view";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import LottieView from "lottie-react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { classNames } from "@/utils/helpers";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/AppModels";
import { useSession, useSignUp, useSignIn } from "@/client/hooks/useAuth";

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

const SetupFormWithZod = withZodForm<SignUpFormType>(SetupFormStep);

const QRCodeStep = ({ formData }: { formData: SignUpFormType | null }) => {
  const [qrValue, setQrValue] = useState("");
  const viewShotRef = useRef<ViewShot & { capture: () => Promise<string> }>(
    null
  );

  useEffect(() => {
    if (formData && qrValue !== JSON.stringify(formData)) {
      setQrValue(JSON.stringify(formData));
    }
  }, [formData, qrValue]);

  const handleSaveQRCode = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current!.capture();
        const targetPath = `${FileSystem.cacheDirectory}gym-world-qrcode.png`;
        await FileSystem.moveAsync({
          from: uri,
          to: targetPath,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(targetPath);
        } else {
          console.error("Sharing is not available");
        }
      } catch (error) {
        console.error("Error saving QR code:", error);
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="mb-5 items-center">
        <Title variant="extra-large">Your unique QR</Title>
        <Text className="text-center text-sm text-gray-500 mb-5">
          Save this QR code to restore access to your account in the future
        </Text>
      </View>
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
        {qrValue ? <QRCode value={qrValue} size={256} /> : null}
      </ViewShot>
      <View className="my-10">
        <Button onPress={handleSaveQRCode} className="min-w-40" text="Save" />
      </View>
    </View>
  );
};

const NotificationsStep = ({
  onNotificationsChange,
  formData,
}: {
  onNotificationsChange: (value: boolean) => void;
  formData: SignUpFormType | null;
}) => {
  const [isChecked, setIsChecked] = useState(formData?.notifications);

  const handleCheckChange = (value: boolean) => {
    setIsChecked(value);
    onNotificationsChange(value);
  };

  return (
    <View className="flex-1 justify-evenly items-center">
      <View className="flex-1 justify-center items-center">
        <Title variant="extra-large">Should we notify you?</Title>
        <LottieView
          source={require("../assets/animations/notify-animation.json")}
          autoPlay={true}
          loop={true}
          style={{ width: 300, height: 300 }}
          speed={1.5}
        />
      </View>
      <View className="flex-row mb-24 w-[90%] justify-center items-center gap-2">
        <TouchableOpacity
          className="flex-row w-1/2 items-center gap-2"
          onPress={() => handleCheckChange(true)}
        >
          <View
            className={classNames(
              "rounded-lg w-full min-h-40 flex justify-center items-center flex-col p-10",
              isChecked ? "bg-primary-800" : "bg-primary-300"
            )}
          >
            <MaterialIcons name="notifications-on" size={50} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row w-1/2 items-center gap-2"
          onPress={() => handleCheckChange(false)}
        >
          <View
            className={classNames(
              "rounded-lg w-full min-h-40 flex justify-center items-center flex-col p-10",
              !isChecked ? "bg-primary-800" : "bg-primary-300"
            )}
          >
            <MaterialIcons name="notifications-off" size={50} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupFormData, setSetupFormData] = useState<SignUpFormType | null>(
    null
  );

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { mutate: signUp, isPending } = useSignUp();
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();
  const { session } = useSession();

  const handleNextStep = () => {
    if (currentStep < WIZARD_LABELS.signUp.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (setupFormData) {
      signUp(setupFormData, {
        onSuccess: () => {
          signIn(
            {
              emailOrUsername: setupFormData.emailOrUsername,
              password: setupFormData.password,
            },
            {
              onSuccess: () => {
                if (session) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Tabs", params: { screen: "Profile" } }],
                  });
                }
              },
            }
          );
        },
        onError: (error) => {
          console.error("Signup failed:", error);
        },
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFormSubmit = (data: SignUpFormType) => {
    setSetupFormData(data);
    handleNextStep();
  };

  const handleNotificationsChange = (value: boolean) => {
    if (setupFormData) {
      setSetupFormData({ ...setupFormData, notifications: value });
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      <View className="w-full px-4 py-4 mt-10">
        <StepIndicator
          customStyles={WIZARD_STYLES}
          currentPosition={currentStep}
          labels={WIZARD_LABELS.signUp}
          stepCount={WIZARD_LABELS.signUp.length}
        />
      </View>
      <TabView
        navigationState={{
          index: currentStep,
          routes: [
            { key: "setup", title: "Setup" },
            { key: "qrcode", title: "QR Code" },
            { key: "notifications", title: "Notifications" },
          ],
        }}
        renderScene={SceneMap({
          setup: () => (
            <ScrollView
              className="flex-1 bg-background"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            >
              <SetupFormWithZod
                defaultValues={{
                  ...SETUP_FORM_MODULE.defaultValues,
                  ...(setupFormData || {}),
                }}
                validationSchema={SETUP_FORM_MODULE.validationSchema}
                onSubmit={handleFormSubmit}
              />
            </ScrollView>
          ),
          qrcode: () => <QRCodeStep formData={setupFormData} />,
          notifications: () => (
            <NotificationsStep
              onNotificationsChange={(value) =>
                handleNotificationsChange(value)
              }
              formData={setupFormData}
            />
          ),
        })}
        onIndexChange={setCurrentStep}
        initialLayout={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        swipeEnabled={false}
        renderTabBar={() => null}
      />
      {currentStep > 0 && (
        <View className="px-4 mb-4 flex-row w-full">
          <View className="flex-1 mr-4">
            <Button
              variant="secondary"
              onPress={handlePreviousStep}
              text="Previous"
            />
          </View>
          <View className="flex-1">
            <Button
              variant="secondary"
              onPress={handleNextStep}
              text={isPending ? "Signing up..." : "Next"}
              disabled={isPending}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SignUp;
