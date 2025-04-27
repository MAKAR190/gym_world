import { User } from "@/types/DatabaseModels";

declare module "@supabase/supabase-js" {
  interface UserMetadata extends Omit<User, "id" | "email"> {}
}
