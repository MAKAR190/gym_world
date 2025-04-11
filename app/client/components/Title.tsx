import { JSX } from "react";
import { Text } from "react-native";

const VARIANT_TO_STYLE_MAP = {
  "extra-large": "text-3xl leading-8 tracking-tight font-inter font-bold",
  large: "text-2xl leading-7 tracking-tight ",
  normal: "text-xl leading-7 tracking-tight ",
  small: "text-lg/8 leading-7 tracking-tight ",
  "extra-small": "text-base leading-6 tracking-tight font-geist",
  tiny: "text-xs/8 leading-6 tracking-tight ",
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

const Title = ({ variant = "normal", children, className = "" }: Props) => {
  return (
    <Text
      className={`${VARIANT_TO_STYLE_MAP[variant]} ${className}`}
    >
      {children}
    </Text>
  );
};

export default Title;
