import { supabase } from "@/lib/supabase";
import { Comment } from "@/types/DatabaseModels";
import { getCurrentUser } from "./auth";
import { AppErrorCodes } from "@/types/AppModels";

export const fetchCommentsByWorkoutId = async (
  workoutId: string
): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      user:users!comments_user_id_fkey (
        username,
        profile_picture
      )
    `
    )
    .eq("workout_id", workoutId)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw AppErrorCodes.FETCH_COMMENTS_FAILED;
  }

  const comments = await Promise.all(
    data.map(async (comment) => {
      const replies = await fetchReplies(comment.id);
      return {
        ...comment,
        replies,
      };
    })
  );

  return comments as Comment[];
};

const fetchReplies = async (parentId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      user:users!comments_user_id_fkey (
        username,
        profile_picture
      )
    `
    )
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });

  if (error) {
    throw AppErrorCodes.FETCH_REPLIES_FAILED;
  }

  return data as Comment[];
};

export const createComment = async (
  workoutId: string,
  content: string,
  parentId?: number
): Promise<Comment> => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  // Get current date in local timezone
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  const { data, error } = await supabase
    .from("comments")
    .insert({
      workout_id: workoutId,
      user_id: user.id,
      content,
      parent_id: parentId || null,
      created_at: localTime.toISOString(),
    })
    .select(
      `
      *,
      user:users!comments_user_id_fkey (
        username,
        profile_picture
      )
    `
    )
    .single();

  if (error) {
    throw AppErrorCodes.CREATE_COMMENT_FAILED;
  }

  return data as Comment;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw AppErrorCodes.USER_NOT_FOUND;
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    throw AppErrorCodes.DELETE_COMMENT_FAILED;
  }
};
