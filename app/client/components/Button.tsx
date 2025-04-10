import React from "react";
import { classNames } from "@/utils/helpers";
import { ActivityIndicator } from "react-native";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  text: string;
  type?: "button" | "submit" | "reset";
}

interface VariantStylesProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export const VARIANT_STYLES = {
  primary: ({ disabled, isLoading }: VariantStylesProps) =>
    `${disabled ? "bg-primary-100 cursor-not-allowed" : "bg-primary-600"} ${
      isLoading ? "text-transparent cursor-wait" : "text-white"
    } flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`,
  secondary: ({ disabled, isLoading }: VariantStylesProps) =>
    `${disabled ? "bg-secondary-100 cursor-not-allowed" : "bg-background"} ${
      isLoading ? "text-transparent cursor-wait" : "text-secondary-900"
    } flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus-visible:ring-transparent`,
};

const Button = ({
  isLoading,
  type,
  className = "",
  disabled,
  variant = "primary",
  text,
  ...rest
}: ButtonProps) => {
  const disable = disabled || isLoading;

  return (
    <button
      {...rest}
      disabled={disable}
      className={classNames(
        VARIANT_STYLES[variant]({
          isLoading,
          disabled,
        }),
        className
      )}
      type={type}
    >
        {isLoading ? (
          <ActivityIndicator
            className="flex items-center justify-center"
            size={20}
          />
        ) : (
          text
      )}
    </button>
  );
};

export default Button;
