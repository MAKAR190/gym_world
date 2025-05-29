import { supabase } from "@/lib/supabase";
import { Exercise } from "@/types/DatabaseModels";
import { AppErrorCodes, PaginatedResponse } from "@/types/AppModels";

export const fetchExercises = async ({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<Exercise>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("exercises")
    .select(
      `
      id,
      name,
      image,
      equipment,
      secondary_muscles,
      instructions,
      body_part,
      target
    `,
      { count: "exact" }
    )
    .range(from, to);

  if (error) {
    throw AppErrorCodes.FETCH_EXERCISES_FAILED;
  }

  return {
    data: data as Exercise[],
    total: count || 0,
    page,
    pageSize,
    hasMore: (count || 0) > to + 1,
  };
};

export const searchExercises = async ({
  query,
  page = 1,
  pageSize = 10,
}: {
  query: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<Exercise>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("exercises")
    .select(
      `
      id,
      name,
      image,
      equipment,
      secondary_muscles,
      instructions,
      body_part,
      target
    `,
      { count: "exact" }
    )
    .ilike("name", `%${query}%`)
    .or(
      `body_part.ilike.%${query}%,target.ilike.%${query}%,equipment.ilike.%${query}%`
    )
    .range(from, to);

  if (error) {
    throw AppErrorCodes.FETCH_EXERCISES_FAILED;
  }

  return {
    data: data as Exercise[],
    total: count || 0,
    page,
    pageSize,
    hasMore: (count || 0) > to + 1,
  };  
};

export const fetchExerciseById = async (id: string): Promise<Exercise> => {
  const { data, error } = await supabase.from("exercises").select("*").eq("id", id).single();

  if (error) {
    throw AppErrorCodes.FETCH_EXERCISE_BY_ID_FAILED;
  }

  return data as Exercise;
};
