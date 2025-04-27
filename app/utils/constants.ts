import { LoginSchema, SignUpSchema } from "@/types/FormModels";

export const LOGIN_FORM_MODULE = {
  defaultValues: {
    emailOrUsername: "",
    password: "",
  },
  validationSchema: LoginSchema,
};

export const SETUP_FORM_MODULE = {
  defaultValues: {
    weightunit: "kg" as const,
    heightunit: "cm" as const,
    gender: "male" as const,
    bodyweight: "",
    height: "",
    emailOrUsername: "",
    password: "",
    notifications: true,
  },
  validationSchema: SignUpSchema,
};

export const WIZARD_STYLES = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#8D4DFF",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#D2B8FF",
  stepStrokeUnFinishedColor: "#dedede",
  separatorFinishedColor: "#D2B8FF",
  separatorUnFinishedColor: "#dedede",
  stepIndicatorFinishedColor: "#D2B8FF",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: "transparent",
  stepIndicatorLabelFinishedColor: "transparent",
  stepIndicatorLabelUnFinishedColor: "transparent",
  labelColor: "#D2B8FF",
  labelSize: 13,
  currentStepLabelColor: "#8D4DFF",
};

export const WIZARD_LABELS = {
  forgotPassword: ["Enter Details", "Verify"],
  signUp: ["Quick Setup", "QR Code", "Notifications"],
};
