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
  wallet_address: string | null;
  push_token: string | null;
}

export interface Exercise {
  id: string;
  name: string;
  image?: string | null;
  equipment: string;
  secondary_muscles?: string | null;
  instructions?: string | null;
  body_part?: string | null;
  target?: string | null;
}

export interface Workout {
  id: string;
  user_id: string;
  duration: string;
  volume: number;
  sets: number;
  created_at: Date;
  photo: string | null;
  likes: string[];
}

export interface Comment {
  id: number;
  workoutId: string;
  userId: string;
  content: string;
  parentId?: number | null;
  created_at: Date;
  replies?: Comment[];
}

export interface Set {
  id: string;
  exercise_id: string;
  reps_count?: number | null;
  time?: number | null;
  weight?: number | null;
  weight_unit?: "kg" | "lbs";
  distance_km?: number | null;
  user_id: string;
  workout_id: string;
}
