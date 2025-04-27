export interface User {
  id: string;
  email: string;
  provider: "email" | "username" | "google";
  weightunit: "kg" | "lbs";
  heightunit: "cm" | "ft";
  gender: "male" | "female";
  username: string;
  bodyweight: number;
  height: number;
  notifications: boolean;
}