import { supabase } from "@/lib/supabase";
import { Workout } from "@/types/DatabaseModels";
import { getCurrentUser } from "./auth";
import { AppErrorCodes } from "@/types/AppModels";

export const fetchWorkouts = async (): Promise<Workout[] | null> => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  const { data, error } = await supabase
    .from("workouts")
    .select(
      `
      id,
      user_id,
      duration,
      volume,
      sets,
      created_at,
      exercises (
        id,
        workout_id,
        name,
        image,
        metric,
        time,
        reps
      )
    `
    )
    .eq("user_id", user.id);

  if (error) {
    throw AppErrorCodes.FETCH_WORKOUTS_FAILED;  
  }

  return data as Workout[];
};
