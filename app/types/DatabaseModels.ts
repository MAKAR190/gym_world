export interface User {
  id: string;
  email: string;
  provider: "email" | "username" | "google";
  weightunit: "kg" | "lbs";
  heightunit: "cm" | "ft";
  gender: "male" | "female";
  username: string;
  bio: string | null;
  bodyweight: number;
  height: number;
  notifications: boolean;
  profile_picture: string;
  created_at: Date;
  updated_at: Date;
  tokens: number;
}

export interface Achievement {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  earned_at: Date;
}

export interface Exercise {
  id: string;
  workout_id: string;
  name: string;
  image?: string;
  metric: "kg" | "km";
  time?: string;
  reps?: number;
}

export interface Workout {
  id: string;
  user_id: string;
  duration: string;
  volume: number;
  sets: number;
  created_at: Date;
  exercises: Exercise[];
}