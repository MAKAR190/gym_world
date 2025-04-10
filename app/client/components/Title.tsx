import { JSX } from "react";
import { Text } from "react-native";

const VARIANT_TO_STYLE_MAP = {
  "extra-large":
    "sm:text-3xl xl:text-4xl text-2xl/8 leading-8 font-bold tracking-tight",
  large:
    "sm:text-2xl xl:text-3xl text-xl/8 leading-7 font-semibold tracking-tight",
  normal:
    "sm:text-xl xl:text-2xl text-lg/8 leading-7 font-semibold tracking-tight",
  small: "sm:text-lg xl:text-xl text-2xl/9 font-bold tracking-tight",
  "extra-small":
    "sm:text-base xl:text-lg text-sm/8 leading-6 font-semibold tracking-tight",
  tiny: "sm:text-[12px] xl:text-base text-xs/8 leading-6 font-semibold tracking-tight",
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