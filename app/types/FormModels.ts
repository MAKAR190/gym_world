import { z } from "zod";

export const LoginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(2, "Username or email must be at least 2 characters")
    .refine((value) => {
      const emailPattern = /^[^\s@]+[@]+[^\s@]+\.[^\s@]+$/;
      const usernamePattern = /^[a-zA-Z0-9_-]+$/;

      if (emailPattern.test(value)) {
        return z.string().email().safeParse(value).success;
      }

      return usernamePattern.test(value);
    }, "Must be a valid email address or username (latin letters, numbers, - and _ only)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const ForgotPasswordSchema = z.object({
  emailOrUsername: LoginSchema.shape.emailOrUsername,
});

export const SignUpSchema = z.object({
  ...LoginSchema.shape,
  weightunit: z.enum(["kg", "lbs"]),
  heightunit: z.enum(["cm", "ft"]),
  gender: z.enum(["male", "female"]),
  bodyweight: z
    .string()
    .refine((value) => !isNaN(Number(value)), "Bodyweight must be a number")
    .refine((value) => Number(value) > 0, "Bodyweight must be greater than 0"),
  height: z.string().refine((value) => {
    const feetPattern = /^(\d+)'(\d+)"$/;
    const numPattern = /^(\d+)$/;

    if (feetPattern.test(value)) {
      const [, feet, inches] = value.match(feetPattern) || [];
      const totalInches = parseInt(feet, 10) * 12 + parseInt(inches, 10);
      return totalInches > 0;
    }

    if (numPattern.test(value)) {
      return Number(value) > 0;
    }

    return false;
  }, "Height must be a positive number or feet/inches format (e.g. 5'10\")"),
  notifications: z.boolean(),
});

export const EditProfileSchema = z.object({
  username: z
    .union([
      z.string().min(2, "Username must be at least 2 characters"),
      z.literal(""),
    ])
    .optional(),
  bio: z
    .union([
      z.string().min(2, "Bio must be at least 2 characters"),
      z.literal(""),
    ])
    .optional(),
  profile_picture: z.string().optional(),
  email: z
    .union([z.string().email("Invalid email address"), z.literal("")])
    .optional(),
  notifications: z.enum(["on", "off"]).optional(),
  weightunit: SignUpSchema.shape.weightunit,
  heightunit: SignUpSchema.shape.heightunit,
  gender: SignUpSchema.shape.gender,
  bodyweight: SignUpSchema.shape.bodyweight,
  height: SignUpSchema.shape.height,
});

export type LoginFormType = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>;
export type SignUpFormType = z.infer<typeof SignUpSchema>;
export type EditProfileFormType = z.infer<typeof EditProfileSchema>;
