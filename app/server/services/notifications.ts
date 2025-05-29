import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { AppErrorCodes } from "@/types/AppModels";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    if (!Constants.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return;
    }

    // Get the current user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) return;

    // Fetch the user's notifications preference
    const { data: userData } = await supabase
      .from("users")
      .select("notifications")
      .eq("id", userId)
      .single();

    if (!userData?.notifications) {
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    const { error } = await supabase
      .from("users")
      .update({ push_token: token.data })
      .eq("id", userId);

    if (error) {
      console.error("Error saving push token:", error);
      throw AppErrorCodes.UPDATE_USER_FAILED;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    throw error;
  }
};

export const sendPushNotification = async (
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) => {
  try {
    const { data: userData } = await supabase
      .from("users")
      .select("notifications")
      .eq("push_token", pushToken)
      .single();

    if (!userData?.notifications) {
      return;
    }

    const message = {
      to: pushToken,
      sound: "default",
      title,
      body,
      data: data || {},
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

export const sendWorkoutReminder = async (pushToken: string) => {
  await sendPushNotification(
    pushToken,
    "Time to Work Out! 💪",
    "Don't forget your daily workout. Your fitness journey continues!",
    { type: "workout_reminder" }
  );
};

export const sendWorkoutCompleteNotification = async (
  pushToken: string,
  workoutType: string
) => {
  await sendPushNotification(
    pushToken,
    "Workout Complete! 🎉",
    `Great job completing your ${workoutType} workout! Keep up the good work!`,
    { type: "workout_complete", workoutType }
  );
};

export const sendWorkoutLikeNotification = async (
  pushToken: string,
  username: string
) => {
  await sendPushNotification(
    pushToken,
    "New Like! ❤️",
    `${username} liked your workout! Keep up the great work!`,
    { type: "achievement" }
  );
};

export const sendAchievementNotification = async (
  pushToken: string,
  achievement: string
) => {
  await sendPushNotification(
    pushToken,
    "Achievement Unlocked! 🏆",
    `Congratulations! You've unlocked the ${achievement} achievement!`,
    { type: "achievement" }
  );
};
