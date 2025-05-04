import { User as DatabaseUser } from "@/types/DatabaseModels";

declare module "@supabase/supabase-js" {
  interface UserMetadata extends Omit<DatabaseUser, "id" | "email"> {}
  interface User extends Omit<DatabaseUser, "email"> {
    email?: string;
  }
}
