import { View } from "react-native";
import Title from "../components/Title";
import Button from "../components/Button";

const ForgotPassword = () => {
  return (
    <View>
      <Title variant="extra-large">Forgot Password</Title>
      <Button variant="primary" text="Reset Password" />
    </View>
  );
};

export default ForgotPassword;
