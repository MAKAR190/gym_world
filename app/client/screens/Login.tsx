import { useState, useEffect } from "react";
import {
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppErrorCodes, RootStackParamList } from "@/types/AppModels";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { auth } from "@/client/hooks";
import { SceneMap, TabView } from "react-native-tab-view";
import { LoginForm, Title } from "@/client/components";
import { LOGIN_FORM_MODULE } from "@/utils/constants";
import LoadingScreen from "./Loading";
import { handleError } from "@/utils/helpers";
import { LoginFormType } from "@/types/FormModels";

export default function LoginScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    mutate: signIn,
    isPending: isSigningIn,
    isError: isSignInError,
  } = auth.useSignIn();

  useEffect(() => {
    if (isSigningIn) {
      setCurrentStep(1);
    }
    if (isSignInError) {
      setCurrentStep(0);
    }
  }, [isSigningIn, isSignInError]);

  return (
    <TabView
      onIndexChange={setCurrentStep}
      initialLayout={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
      swipeEnabled={false}
      renderTabBar={() => null}
      navigationState={{
        index: currentStep,
        routes: [
          { key: "login", title: "Login" },
          { key: "loading", title: "Loading" },
        ],
      }}
      renderScene={SceneMap({
        login: () => (
          <ScrollView className="flex min-h-full flex-1 flex-col bg-background relative isolate">
            <View className="mt-28">
              <Image
                source={require("@/client/assets/logo.png")}
                className="w-32 h-32 mx-auto"
              />
              <Title
                className="text-center w-full text-foreground"
                variant="extra-large"
              >
                Sign in to your account
              </Title>
            </View>

            <View className="mx-auto w-full">
              <View className="bg-white px-6 py-12">
                <View className="space-y-6">
                  <LoginForm
                    defaultValues={LOGIN_FORM_MODULE.defaultValues}
                    validationSchema={LOGIN_FORM_MODULE.validationSchema}
                    onSubmit={(data: LoginFormType) => {
                      signIn(data, {
                        onSuccess: () => {
                          navigation.reset({
                            index: 0,
                            routes: [
                              { name: "Tabs", params: { screen: "Profile" } },
                            ],
                          });
                        },
                        onError: (error: unknown) => {
                          console.error("Login failed:", error);
                          handleError(error as AppErrorCodes);
                        },
                      });
                    }}
                  />
                </View>
              </View>
              {/* <View>
              <View className="relative mt-10 h-4 flex items-center justify-center">
                <View className="absolute top-1/2 w-full h-px bg-secondary-200" />
                <View className="z-10 px-2">
                  <Text className="px-4 text-sm font-medium text-foreground bg-background font-inter">
                    Or continue with
                  </Text>
                </View>
              </View> */}
              {/* // TODO: Add Google sign in */}
              {/* <View className="mt-6 flex flex-row ">
                <Button
                  text="Google"
                  variant="secondary"
                  className="w-full mt-2"
                  Icon={{
                    type: "svg",
                    Component: GoogleIconSvg,
                    size: 24,
                  }}
                />
              </View> */}
              {/* </View>
          </View> */}
              <View className="flex-row justify-center items-center">
                <Text className="text-center text-md font-inter text-secondary-500">
                  Not a member?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text className="font-semibold text-md text-primary-600 font-geist">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ),
        loading: () => <LoadingScreen />,
      })}
    />
  );
}
