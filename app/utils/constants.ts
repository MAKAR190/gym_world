import { LoginSchema } from "@/types/FormModels";

export const LOGIN = {
    defaultValues: {
        emailOrUsername: "",
        password: "",
    },
    validationSchema: LoginSchema,
};