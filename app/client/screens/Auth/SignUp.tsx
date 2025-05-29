import React, { useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import StepIndicator from "react-native-step-indicator";
import {
  WIZARD_STYLES,
  WIZARD_ROUTES,
  SETUP_FORM_MODULE,
} from "@/utils/constants";
import { SignUpFormType } from "@/types/FormModels";
import { SceneMap, TabView } from "react-native-tab-view";
import {
  Button,
  SetupFormWithZod,
  QRCodeStep,
  NotificationsStep,
} from "../../components";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList, AppErrorCodes } from "@/types/AppModels";
import { auth } from "@/client/hooks";
import LoadingScreen from "../App/Loading";
import { handleError } from "@/utils/helpers";

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupFormData, setSetupFormData] = useState<SignUpFormType | null>(
    null
  );

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { mutate: signUp, isPending: isSigningUp } = auth.useSignUp();
  const { mutate: signIn } = auth.useSignIn();

  const handleNextStep = () => {
    if (currentStep < WIZARD_ROUTES.signUp.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (setupFormData) {
      setCurrentStep(WIZARD_ROUTES.signUp.length);
      signUp(setupFormData, {
        onSuccess: () => {
          signIn(
            {
              emailOrUsername: setupFormData.emailOrUsername,
              password: setupFormData.password,
            },
            {
              onSuccess: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Tabs", params: { screen: "Profile" } }],
                });
              },
            }
          );
        },
        onError: (error: unknown) => {
          console.error("Signup failed:", error);
          handleError(error as AppErrorCodes);
          setCurrentStep((prev) => prev - 1);
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
          labels={WIZARD_ROUTES.signUp.map((route) => route.title)}
          stepCount={WIZARD_ROUTES.signUp.length}
        />
      </View>
      <TabView
        navigationState={{
          index: currentStep,
          routes: [
            ...WIZARD_ROUTES.signUp,
            { key: "loading", title: "Loading" },
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
          loading: () => <LoadingScreen />,
        })}
        onIndexChange={setCurrentStep}
        initialLayout={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        swipeEnabled={false}
        renderTabBar={() => null}
      />
      {currentStep > 0 && currentStep < WIZARD_ROUTES.signUp.length && (
        <View className="px-4 mb-20 flex-row w-full">
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
              text={
                currentStep === WIZARD_ROUTES.signUp.length - 1
                  ? "Finish"
                  : "Next"
              }
              disabled={isSigningUp}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SignUp;
