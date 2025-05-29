import {
  EditProfileSchema,
  LoginSchema,
  SignUpSchema,
} from "@/types/FormModels";
import { User as DatabaseUser } from "@/types/DatabaseModels";
import { User as SupabaseUser } from "@supabase/auth-js";

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

export const EDIT_PROFILE_FORM_MODULE = (
  user: DatabaseUser | SupabaseUser
) => ({
  defaultValues: {
    username: user?.username || "",
    bio: user?.bio || "",
    profile_picture: user?.profile_picture || "",
    email: user?.email || "",
    notifications: user?.notifications || false,
    weightunit: user?.weightunit || "kg",
    heightunit: user?.heightunit || "cm",
    gender: user?.gender || "male",
    bodyweight: String(user?.bodyweight) || "",
    height: String(user?.height) || "",
  },
  validationSchema: EditProfileSchema,
});

export const WIZARD_STYLES = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#3B82F6",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#93C5FD",
  stepStrokeUnFinishedColor: "#dedede",
  separatorFinishedColor: "#93C5FD",
  separatorUnFinishedColor: "#dedede",
  stepIndicatorFinishedColor: "#93C5FD",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: "transparent",
  stepIndicatorLabelFinishedColor: "transparent",
  stepIndicatorLabelUnFinishedColor: "transparent",
  labelColor: "#93C5FD",
  labelSize: 13,
  currentStepLabelColor: "#3B82F6",
};

export const WIZARD_ROUTES = {
  forgotPassword: [
    { key: "enterDetails", title: "Enter Details" },
    { key: "verify", title: "Verify" },
  ],
  signUp: [
    { key: "setup", title: "Setup" },
    { key: "qrcode", title: "QR Code" },
    { key: "notifications", title: "Notifications" },
  ],
  workout: [
    { key: "workout", title: "Workout" },
    { key: "exercises", title: "Exercises" },
  ],
};

export const DEFAULT_PROFILE_PICTURE =
  "https://hkfdeydxmhdqjhqjhihr.supabase.co/storage/v1/object/sign/profile-pictures/default_avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzY5Njg5ZDJmLTAxN2YtNGNlMC1hMjRiLWM0OTEyNTk5ZWViMiJ9.eyJ1cmwiOiJwcm9maWxlLXBpY3R1cmVzL2RlZmF1bHRfYXZhdGFyLnBuZyIsImlhdCI6MTc0NjIwMDkxNywiZXhwIjo0ODk5ODAwOTE3fQ.gOlpWu8-eh_05jj2nhqTFXB0HTs6i7bd2thYZk1g3hw";
