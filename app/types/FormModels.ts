import { z } from "zod";

export const LoginSchema = z.object({
  emailOrUsername: z.string()
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

export type LoginFormType = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>;
