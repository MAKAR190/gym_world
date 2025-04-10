import { JSX } from "react";
import { Text } from "react-native";

const VARIANT_TO_STYLE_MAP = {
  "extra-large":
    "text-3xl leading-8 font-bold tracking-tight",
  large:
    "text-2xl leading-7 font-semibold tracking-tight",
  normal:
    "text-xl leading-7 font-semibold tracking-tight",
  small: "text-lg/8 leading-7 font-bold tracking-tight",
  "extra-small":
    "text-base leading-6 font-semibold tracking-tight",
  tiny: "text-xs/8 leading-6 font-semibold tracking-tight",
};

interface Props {
  variant?:
    | "extra-large"
    | "large"
    | "normal"
    | "small"
    | "extra-small"
    | "tiny";
  className?: string;
  children?: JSX.Element | string;
}

const Title = ({
  variant = "normal",
  children,
  className = "",
}: Props) => {
  return (
    <Text className={`${VARIANT_TO_STYLE_MAP[variant]} ${className}`}>
      {children}
    </Text>
  );
};

export default Title;