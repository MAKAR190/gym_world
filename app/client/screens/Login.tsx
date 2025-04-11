import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Title from "@/client/components/Title";
import InputField from "@/client/components/Input";
import { withZodForm, InjectedProps } from "@/client/hocs/WithZodForm";
import { LoginFormType } from "@/types/FormModels";
import { LOGIN } from "@/utils/constants";
import Button from "@/client/components/Button";
import GoogleIconSvg from "@/client/assets/icons/google-icon.svg";

const LoginFormComponent = ({
  form,
  handleFormSubmit,
}: InjectedProps<LoginFormType>) => {
  const { control } = form;

  return (
    <View>
      <View>
        <InputField
          label="Email address or username"
          id="emailOrUsername"
          name="emailOrUsername"
          control={control}
          autoComplete="email"
          inputMode="email"
        />
      </View>
      <View>
        <InputField
          label="Password"
          id="password"
          name="password"
          control={control}
          type="password"
          autoComplete="password"
        />
      </View>
      <View className="mt-4">
        <TouchableOpacity className="w-full flex justify-end">
          <Title variant="extra-small" className="text-primary-600">
            Forgot password?
          </Title>
        </TouchableOpacity>
      </View>
      <View className="mt-4">
        <Button
          text="Sign in"
          variant="primary"
          onPress={handleFormSubmit}
          className="mx-auto"
        />
      </View>
    </View>
  );
};

const LoginForm = withZodForm<LoginFormType>(LoginFormComponent);

export default function LoginScreen() {
  return (
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
              defaultValues={LOGIN.defaultValues}
              validationSchema={LOGIN.validationSchema}
              onSubmit={(data) => {
                console.log(data);
              }}
            />
          </View>
          <View>
            <View className="relative mt-10 h-4 flex items-center justify-center">
              <View className="absolute top-1/2 w-full h-px bg-secondary-200" />
              <View className="z-10 px-2">
                <Text className="px-4 text-sm font-medium text-foreground bg-background font-inter">
                  Or continue with
                </Text>
              </View>
            </View>
            <View className="mt-6 flex flex-row ">
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
            </View>
          </View>
        </View>

        <View className="flex-row justify-center items-center">
          <Text className="text-center text-md font-inter text-secondary-500">
            Not a member?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="font-semibold text-md text-primary-600 font-geist">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
