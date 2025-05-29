import { supabase } from "@/lib/supabase";
import { Set } from "@/types/DatabaseModels";
import { getCurrentUser } from "./auth";
import { AppErrorCodes } from "@/types/AppModels";

export const createSets = async (sets: Omit<Set, "id">[]): Promise<Set[]> => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  const setsWithUser = sets.map((set) => ({
    ...set,
    user_id: user.id,
  }));

  const { data, error } = await supabase
    .from("sets")
    .insert(setsWithUser)
    .select();

  if (error) {
    throw AppErrorCodes.CREATE_SETS_FAILED;
  }

  return data as Set[];
};

export const fetchSetsByExerciseId = async (
  exerciseId: string
): Promise<Set[]> => {
  const { data, error } = await supabase
    .from("sets")
    .select("*")
    .eq("exercise_id", exerciseId);

  if (error) {
    throw AppErrorCodes.FETCH_SETS_BY_EXERCISE_ID_FAILED;
  }

  return data as Set[];
};
