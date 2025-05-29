import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  fetchCommentsByWorkoutId,
  createComment,
} from "@/server/services/comments";
import { Comment } from "@/types/DatabaseModels";
import { getCurrentUser } from "@/server/services/auth";
import { formatDistanceToNow, isValid } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constants";

interface CommentWithUser extends Omit<Comment, "replies"> {
  user?: {
    username: string;
    profile_picture: string | null;
  };
  replies?: CommentWithUser[];
}

const formatDate = (date: Date | string): string => {
  try {
    const parsedDate = new Date(date);
    if (!isValid(parsedDate)) {
      return "Invalid date";
    }
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch {
    return "Invalid date";
  }
};

const CommentItem = ({
  comment,
  onReply,
}: {
  comment: CommentWithUser;
  onReply: (commentId: number) => void;
}) => {
  return (
    <View className="p-4 border-b border-gray-200">
      <View className="flex-row items-start">
        <Image
          source={
            comment.user?.profile_picture
              ? { uri: comment.user.profile_picture }
              : (DEFAULT_PROFILE_PICTURE as ImageSourcePropType)
          }
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-gray-800">
              {comment.user?.username || "Anonymous"}
            </Text>
            <Text className="text-gray-500 text-xs">
              {formatDate(comment.created_at)}
            </Text>
          </View>
          <Text className="mt-1 text-gray-700">{comment.content}</Text>
          <TouchableOpacity
            onPress={() => onReply(comment.id)}
            className="mt-2 flex-row items-center"
          >
            <Ionicons name="chatbubble-outline" size={16} color="#3b82f6" />
            <Text className="text-blue-500 ml-1">Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      {comment.replies && comment.replies.length > 0 && (
        <View className="ml-12 mt-2">
          {comment.replies.map((reply) => (
            <View key={reply.id} className="p-3 bg-gray-50 rounded-lg mb-2">
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-gray-800">
                  {reply.user?.username || "Anonymous"}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {formatDate(reply.created_at)}
                </Text>
              </View>
              <Text className="mt-1 text-gray-700">{reply.content}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const Comments = () => {
  const route = useRoute();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { workoutId } = route.params as { workoutId: string };

  const loadComments = useCallback(async () => {
    try {
      const fetchedComments = await fetchCommentsByWorkoutId(workoutId);
      setComments(fetchedComments as CommentWithUser[]);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [workoutId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { user } = await getCurrentUser();
      if (!user) return;

      await createComment(workoutId, newComment, replyingTo || undefined);
      setNewComment("");
      setReplyingTo(null);
      loadComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-10">
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <CommentItem comment={item} onReply={handleReply} />
        )}
        keyExtractor={(item) => item.id.toString()}
        className="flex-1"
        contentContainerClassName="pb-4"
      />
      <View className="p-4 border-t border-gray-200 bg-white">
        {replyingTo && (
          <View className="flex-row items-center justify-between mb-2 bg-blue-50 p-2 rounded-lg">
            <Text className="text-blue-600">Replying to comment</Text>
            <TouchableOpacity
              onPress={() => setReplyingTo(null)}
              className="flex-row items-center"
            >
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text className="text-red-500 ml-1">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="flex-row mb-4">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 bg-gray-50"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSubmitComment}
            className="bg-blue-500 px-4 justify-center rounded-r-lg"
            disabled={!newComment.trim()}
          >
            <Text className="text-white font-semibold">Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Comments;
