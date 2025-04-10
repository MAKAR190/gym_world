import React from "react";
import {
  useForm,
  DefaultValues,
  SubmitHandler,
  FieldErrors,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type WithZodFormProps<T extends Record<string, unknown>> = {
  defaultValues: DefaultValues<T>;
  validationSchema: z.ZodType<T>;
  onSubmit: SubmitHandler<T>;
  onError?: (errors: FieldErrors<T>) => void;
};

export type InjectedProps<T extends Record<string, unknown>> = {
  form: ReturnType<typeof useForm<T>>;
  handleFormSubmit: () => void;
};

export function withZodForm<
  T extends Record<string, unknown>,
  P extends object = {},
>(Component: React.ComponentType<P & InjectedProps<T>>) {
  return function WithZodForm({
    defaultValues,
    validationSchema,
    onSubmit,
    onError,
    ...props
  }: P & WithZodFormProps<T>) {
    const form = useForm<T>({
      resolver: zodResolver(validationSchema) as Resolver<T>,
      defaultValues: defaultValues,
      mode: "onSubmit",
      reValidateMode: "onSubmit",
    });

    const handleFormSubmit = React.useCallback(() => {
      form.handleSubmit(
        (data) => onSubmit(data),
        (errors) => {
          if (onError) {
            onError(errors);
          }
        }
      )();
    }, [form, onSubmit, onError]);

    return (
      <Component
        {...(props as P)}
        form={form}
        handleFormSubmit={handleFormSubmit}
      />
    );
  };
}