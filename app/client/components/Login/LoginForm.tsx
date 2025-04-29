import { View } from "react-native";
import InputField from "@/client/components/Input";
import { InjectedProps } from "@/client/hocs/WithZodForm";
import { WithZodForm } from "@/client/hocs";
import { LoginFormType } from "@/types/FormModels";
import Button from "@/client/components/Button";

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
      {/* // TODO: Add forgot password
       <View className="mt-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="w-full flex justify-end"
          >
            <Title variant="extra-small" className="text-primary-600">
              Forgot password?
            </Title>
          </TouchableOpacity>
        </View> */}
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

const LoginForm = WithZodForm<LoginFormType>(LoginFormComponent);

export default LoginForm;
