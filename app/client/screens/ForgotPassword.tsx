import React, { useState } from "react";
import { View, Text } from "react-native";
import Title from "../components/Title";
import Button from "../components/Button";
import { InjectedProps, withZodForm } from "../hocs/WithZodForm";
import {
  ForgotPasswordFormType,
  ForgotPasswordSchema,
} from "../../types/FormModels";
import InputField from "@/client/components/Input";
import LottieView from "lottie-react-native";
import StepIndicator from "react-native-step-indicator";

const stepIndicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#8D4DFF",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#D2B8FF",
  stepStrokeUnFinishedColor: "#dedede",
  separatorFinishedColor: "#D2B8FF",
  separatorUnFinishedColor: "#dedede",
  stepIndicatorFinishedColor: "#D2B8FF",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: "transparent",
  stepIndicatorLabelFinishedColor: "transparent",
  stepIndicatorLabelUnFinishedColor: "transparent",
  labelColor: "#D2B8FF",
  labelSize: 13,
  currentStepLabelColor: "#8D4DFF",
};
const labels = ["Enter Details", "Verify", "Complete"];

const ForgotPasswordForm = ({
  form,
  handleFormSubmit,
}: InjectedProps<ForgotPasswordFormType>) => {
  const { handleSubmit, control } = form;

  return (
    <View className="px-4 gap-4">
      <View className="gap-2 mt-8 mb-4">
        <Title variant="extra-large" className="text-4xl">
          Forgot Password
        </Title>
        <Text className="text-gray-500">
          Please, enter your email or username to reset your password. We will
          send you a link to reset your password or check your QR code.
        </Text>
      </View>
      <InputField
        control={control}
        name="emailOrUsername"
        label="Enter your email or username"
      />
      <View className="self-end">
        <Button
          variant="primary"
          text="Reset Password"
          onPress={handleSubmit(handleFormSubmit)}
        />
      </View>
    </View>
  );
};

const ForgotPasswordFormComponent =
  withZodForm<ForgotPasswordFormType>(ForgotPasswordForm);

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < labels.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <View className="flex-1 justify-center  bg-background">
      <View className="w-full px-4 py-4 mb-10">
        <StepIndicator
          customStyles={stepIndicatorStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={labels.length}
        />
      </View>
      <LottieView
        source={require("../assets/animations/jogging-phone-animation.json")}
        autoPlay={true}
        loop={true}
        style={{ width: 250, height: 250 }}
        speed={2}
      />
      <ForgotPasswordFormComponent
        defaultValues={{ emailOrUsername: "" }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleNextStep}
      />
    </View>
  );
};

export default ForgotPassword;
