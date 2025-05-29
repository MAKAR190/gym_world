import { supabase } from "@/lib/supabase";
import { Workout, Set } from "@/types/DatabaseModels";
import { getCurrentUser } from "./auth";
import { AppErrorCodes } from "@/types/AppModels";
import { fetchExerciseById } from "./exercises";
import { decode } from "@/utils/helpers";
import * as FileSystem from "expo-file-system";
import { sendWorkoutLikeNotification } from "./notifications";

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
      photo,
      likes,
      created_at
    `
    )
    .eq("user_id", user.id);

  if (error) {
    throw AppErrorCodes.FETCH_WORKOUTS_FAILED;
  }

  return data as Workout[];
};

export const uploadWorkoutPhoto = async (photoUri: string): Promise<string> => {
  const { user } = await getCurrentUser();
  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  try {
    const fileInfo = await FileSystem.getInfoAsync(photoUri, {
      size: true,
    });
    if (!fileInfo.exists) {
      throw AppErrorCodes.FILE_NOT_FOUND;
    }

    if (fileInfo.size && fileInfo.size > 25 * 1024 * 1024) {
      throw AppErrorCodes.FILE_TOO_LARGE;
    }

    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileExtension = photoUri.split(".").pop();
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    if (
      !fileExtension ||
      !allowedExtensions.includes(fileExtension.toLowerCase())
    ) {
      throw AppErrorCodes.INVALID_FILE_TYPE;
    }

    const fileName = `${user.id}/${Date.now()}.${fileExtension}`;
    console.log("Uploading file:", fileName);

    const { error: uploadError } = await supabase.storage
      .from("workout-photos")
      .upload(fileName, decode(base64), {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading to Supabase:", uploadError);
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("workout-photos").getPublicUrl(fileName);

    console.log("Upload successful, public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadWorkoutPhoto:", error);
    throw error;
  }
};

export const createWorkout = async (
  duration: string,
  volume: number,
  sets: number,
  photo?: string
): Promise<Workout | null> => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      duration,
      volume,
      sets,
      photo,
    })
    .select()
    .single();

  if (error) {
    throw AppErrorCodes.CREATE_WORKOUT_FAILED;
  }

  return data as Workout;
};

export const createExerciseWorkout = async (
  exerciseId: string,
  workoutId: string
): Promise<void> => {
  const { error } = await supabase.from("exercise_workouts").insert({
    exercise_id: exerciseId,
    workout_id: workoutId,
  });

  if (error) {
    throw AppErrorCodes.CREATE_EXERCISE_WORKOUT_FAILED;
  }
};

export const fetchWorkoutById = async (id: string): Promise<Workout> => {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw AppErrorCodes.FETCH_WORKOUT_BY_ID_FAILED;
  }

  return data as Workout;
};

export const fetchWorkoutExercises = async (workoutId: string) => {
  const { data: exerciseWorkouts, error: exerciseWorkoutsError } =
    await supabase
      .from("exercise_workouts")
      .select("exercise_id")
      .eq("workout_id", workoutId);

  if (exerciseWorkoutsError) {
    throw AppErrorCodes.FETCH_WORKOUT_EXERCISES_FAILED;
  }

  return exerciseWorkouts;
};

export const fetchWorkoutWithDetails = async (workout: Workout) => {
  const { user } = await getCurrentUser();
  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  const exerciseWorkouts = await fetchWorkoutExercises(workout.id);

  const exercises = await Promise.all(
    exerciseWorkouts.map(async (ew) => {
      const exercise = await fetchExerciseById(ew.exercise_id);

      const { data: sets, error } = await supabase
        .from("sets")
        .select("*")
        .eq("exercise_id", ew.exercise_id)
        .eq("workout_id", workout.id)
        .eq("user_id", workout.user_id);

      if (error) {
        console.error("Error fetching sets:", error);
      }

      return {
        exercise,
        sets: sets || [],
      };
    })
  );

  return {
    ...workout,
    exercises,
  };
};

export const createSets = async (
  sets: Omit<Set, "id">[],
  workoutId: string
): Promise<Set[]> => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  const setsWithUser = sets.map((set) => ({
    ...set,
    user_id: user.id,
    workout_id: workoutId,
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

export const toggleWorkoutLike = async (workoutId: string): Promise<void> => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  const { data: workout, error: fetchError } = await supabase
    .from("workouts")
    .select("likes, user_id")
    .eq("id", workoutId)
    .single();

  if (fetchError) {
    throw AppErrorCodes.FETCH_WORKOUT_BY_ID_FAILED;
  }

  const currentLikes = workout.likes || [];
  const hasLiked = currentLikes.includes(user.id);

  const newLikes = hasLiked
    ? currentLikes.filter((id: string) => id !== user.id)
    : [...currentLikes, user.id];

  const { error: updateError } = await supabase
    .from("workouts")
    .update({ likes: newLikes })
    .eq("id", workoutId)
    .select();

  if (updateError) {
    console.error("Error updating likes:", updateError);
    throw AppErrorCodes.UPDATE_WORKOUT_FAILED;
  }

  // Send notification if the workout was liked (not unliked)
  if (!hasLiked && workout.user_id !== user.id) {
    // Get the workout owner's push token
    const { data: ownerData } = await supabase
      .from("users")
      .select("push_token, username")
      .eq("id", workout.user_id)
      .single();

    if (ownerData?.push_token) {
      await sendWorkoutLikeNotification(
        ownerData.push_token,
        user.username || "Someone"
      );
    }
  }
};

export const fetchAllWorkouts = async (): Promise<Workout[] | null> => {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `
      id,
      user_id,
      duration,
      volume,
      sets,
      photo,
      likes,
      created_at,
      user:users!workouts_user_id_fkey (
        id,
        username,
        profile_picture
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching all workouts:", error);
    throw AppErrorCodes.FETCH_WORKOUTS_FAILED;
  }

  return data as Workout[];
};
